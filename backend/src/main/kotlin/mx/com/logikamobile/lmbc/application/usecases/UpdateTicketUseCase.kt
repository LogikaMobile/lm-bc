package mx.com.logikamobile.lmbc.application.usecases

import kotlinx.serialization.Serializable
import mx.com.logikamobile.lmbc.application.interfaces.TicketRepository

@Serializable
data class UpdateTicketRequest(
    val status: String? = null,
    val priority: String? = null,
    val type: String? = null,
    val description: String? = null,
    val serviceHours: Int? = null,
    val startedAt: String? = null,
    val closedAt: String? = null
)

class UpdateTicketUseCase(private val ticketRepository: TicketRepository) {
    suspend fun execute(
        ticketId: Int, 
        request: UpdateTicketRequest, 
        companyType: String
    ): Boolean {
        if (companyType != "INTERNAL") {
            throw IllegalArgumentException("Only internal administrators can update tickets")
        }

        val parsedStartedAt = request.startedAt?.let { java.time.LocalDateTime.parse(it) }
        val parsedClosedAt = request.closedAt?.let { java.time.LocalDateTime.parse(it) }

        return ticketRepository.updateTicket(
            id = ticketId,
            status = request.status,
            priority = request.priority,
            type = request.type,
            description = request.description,
            serviceHours = request.serviceHours,
            startedAt = parsedStartedAt,
            closedAt = parsedClosedAt
        )
    }
}
