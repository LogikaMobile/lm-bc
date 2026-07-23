package mx.com.logikamobile.lmbc.presentation.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import mx.com.logikamobile.lmbc.application.usecases.LoginUseCase
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(val email: String, val passwordRaw: String)
@Serializable
data class UserDto(val id: Int, val name: String, val email: String)
@Serializable
data class CompanyDto(
    val id: Int, 
    val name: String, 
    val type: String,
    val primaryColor: String? = null,
    val secondaryColor: String? = null,
    val accentColor: String? = null,
    val logoPath: String? = null
)

fun Route.authRoutes() {
    val loginUseCase = org.koin.core.context.GlobalContext.get().get<LoginUseCase>()

    route("/api/auth") {
        post("/login") {
            val req = call.receive<LoginRequest>()
            
            val result = loginUseCase.execute(req.email, req.passwordRaw)
            
            if (result != null) {
                call.respond(HttpStatusCode.OK, result)
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid credentials"))
            }
        }
    }
}
