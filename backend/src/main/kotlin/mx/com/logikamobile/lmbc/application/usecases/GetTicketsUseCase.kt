package mx.com.logikamobile.lmbc.application.usecases

import kotlinx.serialization.Serializable
import mx.com.logikamobile.lmbc.application.interfaces.TicketRepository

@Serializable
data class TicketDTO(
    val id: Int,
    val projectId: Int,
    val createdBy: Int,
    val type: String,
    val status: String,
    val priority: String,
    val description: String,
    val createdAt: String,
    val updatedAt: String,
    val deletedAt: String?
)

class GetTicketsUseCase(
    private val ticketRepository: TicketRepository
) {
    suspend fun execute(companyId: Int, companyType: String, limit: Int, offset: Int): List<TicketDTO> {
        return ticketRepository.getTickets(limit, offset.toLong(), companyId, companyType).map { ticket ->
            TicketDTO(
                id = ticket.id,
                projectId = ticket.projectId,
                createdBy = ticket.createdBy,
                type = ticket.type,
                status = ticket.status,
                priority = ticket.priority,
                description = ticket.description,
                createdAt = ticket.createdAt.toString(),
                updatedAt = ticket.updatedAt.toString(),
                deletedAt = ticket.deletedAt?.toString()
            )
        }
    }
}
