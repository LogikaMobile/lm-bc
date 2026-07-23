package mx.com.logikamobile.lmbc.presentation.routes

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.consumeEach
import java.util.Collections
import kotlinx.serialization.json.Json
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import mx.com.logikamobile.lmbc.application.interfaces.TicketMessageRepository
import mx.com.logikamobile.lmbc.application.usecases.GetTicketsUseCase
import mx.com.logikamobile.lmbc.domain.entities.TicketMessage
import kotlinx.coroutines.withTimeoutOrNull
import io.ktor.server.request.receive

@Serializable
data class WsAuthMessage(val token: String)

@Serializable
data class WsChatIncoming(val message: String)

@Serializable
data class WsChatOutgoing(val message: String, val senderId: Int, val senderName: String, val timestamp: String)

@Serializable
data class WsStatusMessage(val status: String)

val ticketConnections = Collections.synchronizedMap(mutableMapOf<Int, MutableSet<DefaultWebSocketServerSession>>())

fun Route.ticketRoutes() {
    val getTicketsUseCase = org.koin.core.context.GlobalContext.get().get<GetTicketsUseCase>()
    val ticketMessageRepository = org.koin.core.context.GlobalContext.get().get<TicketMessageRepository>()

    authenticate("auth-jwt") {
        route("/api/tickets") {
            get {
                val principal = call.principal<JWTPrincipal>()
                val companyId = principal?.payload?.getClaim("companyId")?.asInt() ?: return@get call.respond(io.ktor.http.HttpStatusCode.Unauthorized)
                val companyType = principal.payload.getClaim("companyType")?.asString() ?: "CLIENT"
                
                val limit = call.request.queryParameters["limit"]?.toIntOrNull() ?: 10
                val offset = call.request.queryParameters["offset"]?.toIntOrNull() ?: 0

                val tickets = getTicketsUseCase.execute(companyId, companyType, limit, offset)
                call.respond(tickets)
            }

            post {
                val principal = call.principal<JWTPrincipal>()
                val companyId = principal?.payload?.getClaim("companyId")?.asInt() ?: return@post call.respond(io.ktor.http.HttpStatusCode.Unauthorized)
                val userId = principal.payload.getClaim("userId")?.asInt() ?: return@post call.respond(io.ktor.http.HttpStatusCode.Unauthorized)
                val companyType = principal.payload.getClaim("companyType")?.asString() ?: "CLIENT"
                
                if (companyType != "CLIENT") {
                    return@post call.respond(io.ktor.http.HttpStatusCode.Forbidden, mapOf("error" to "Only clients can create tickets via this endpoint"))
                }

                val createTicketUseCase = org.koin.core.context.GlobalContext.get().get<mx.com.logikamobile.lmbc.application.usecases.CreateTicketUseCase>()
                try {
                    val request = call.receive<mx.com.logikamobile.lmbc.application.usecases.CreateTicketRequest>()
                    val ticketId = createTicketUseCase.execute(request, companyId, userId)
                    call.respond(io.ktor.http.HttpStatusCode.Created, mapOf("ticketId" to ticketId))
                } catch (e: Exception) {
                    call.respond(io.ktor.http.HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }

            put("/{id}") {
                val principal = call.principal<JWTPrincipal>()
                val companyType = principal?.payload?.getClaim("companyType")?.asString() ?: return@put call.respond(io.ktor.http.HttpStatusCode.Unauthorized)
                
                val ticketId = call.parameters["id"]?.toIntOrNull()
                if (ticketId == null) {
                    return@put call.respond(io.ktor.http.HttpStatusCode.BadRequest, mapOf("error" to "Invalid ticket ID"))
                }

                val updateTicketUseCase = org.koin.core.context.GlobalContext.get().get<mx.com.logikamobile.lmbc.application.usecases.UpdateTicketUseCase>()
                try {
                    val request = call.receive<mx.com.logikamobile.lmbc.application.usecases.UpdateTicketRequest>()
                    val success = updateTicketUseCase.execute(ticketId, request, companyType)
                    if (success) {
                        call.respond(io.ktor.http.HttpStatusCode.OK, mapOf("message" to "Ticket updated successfully"))
                    } else {
                        call.respond(io.ktor.http.HttpStatusCode.NotFound, mapOf("error" to "Ticket not found or could not be updated"))
                    }
                } catch (e: IllegalArgumentException) {
                    call.respond(io.ktor.http.HttpStatusCode.Forbidden, mapOf("error" to (e.message ?: "Forbidden")))
                } catch (e: Exception) {
                    call.respond(io.ktor.http.HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }
        }

        route("/api/client/projects") {
            get {
                val principal = call.principal<JWTPrincipal>()
                val companyId = principal?.payload?.getClaim("companyId")?.asInt() ?: return@get call.respond(io.ktor.http.HttpStatusCode.Unauthorized)
                val companyType = principal.payload.getClaim("companyType")?.asString() ?: "CLIENT"
                
                if (companyType != "CLIENT") {
                    return@get call.respond(io.ktor.http.HttpStatusCode.Forbidden, mapOf("error" to "Only clients can access this endpoint"))
                }

                val getClientProjectsUseCase = org.koin.core.context.GlobalContext.get().get<mx.com.logikamobile.lmbc.application.usecases.GetClientProjectsUseCase>()
                val projects = getClientProjectsUseCase.execute(companyId)
                call.respond(projects)
            }
        }
    }

    webSocket("/ws/tickets/{id}/chat") {
        val ticketId = call.parameters["id"]?.toIntOrNull()
        if (ticketId == null) {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Invalid ticket ID"))
            return@webSocket
        }

        val authFrame = withTimeoutOrNull(3000) {
            incoming.receiveCatching().getOrNull()
        } as? Frame.Text

        if (authFrame == null) {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Missing or delayed Auth Token"))
            return@webSocket
        }

        val authPayload = Json { ignoreUnknownKeys = true }.decodeFromString<WsAuthMessage>(authFrame.readText())
        if (authPayload.token.isBlank()) {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Invalid Token"))
            return@webSocket
        }

        val userId = try {
            com.auth0.jwt.JWT.decode(authPayload.token).getClaim("userId").asInt() ?: throw Exception("Missing userId")
        } catch (e: Exception) {
            close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Invalid Token Payload"))
            return@webSocket
        }

        val connectionsForTicket = ticketConnections.computeIfAbsent(ticketId) { Collections.synchronizedSet(mutableSetOf()) }
        connectionsForTicket.add(this)

        try {
            // Send connected status
            send(Frame.Text(Json.encodeToString(WsStatusMessage("connected"))))

            val messages = ticketMessageRepository.getMessagesForTicket(ticketId, 50, 0)
            messages.reversed().forEach { msg ->
                val jsonMsg = Json.encodeToString(WsChatOutgoing(msg.message, msg.senderId, msg.senderName ?: "Unknown", msg.timestamp.toString()))
                send(Frame.Text(jsonMsg))
            }

            incoming.consumeEach { frame ->
                if (frame is Frame.Text) {
                    val text = frame.readText()
                    try {
                        val incomingMessage = Json { ignoreUnknownKeys = true }.decodeFromString<WsChatIncoming>(text)
                        
                        if (incomingMessage.message.isNotBlank()) {
                            val insertedMsg = ticketMessageRepository.insertMessage(
                                ticketId = ticketId,
                                senderId = userId,
                                message = incomingMessage.message
                            )
                            
                            val responseJson = Json.encodeToString(WsChatOutgoing(insertedMsg.message, insertedMsg.senderId, insertedMsg.senderName ?: "Unknown", insertedMsg.timestamp.toString()))
                            
                            // Broadcast to everyone connected to this ticket
                            connectionsForTicket.toList().forEach { session ->
                                try {
                                    session.send(Frame.Text(responseJson))
                                } catch (e: Exception) {
                                    // Ignore send errors for disconnected sessions
                                }
                            }
                        }
                    } catch (e: Exception) {
                        println("Failed to parse incoming WS message: ${e.message}")
                    }
                }
            }
        } finally {
            // Clean up when this socket closes
            connectionsForTicket.remove(this)
            if (connectionsForTicket.isEmpty()) {
                ticketConnections.remove(ticketId)
            }
        }
    }
}
