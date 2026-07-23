package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.TicketRepository
import mx.com.logikamobile.lmbc.application.interfaces.ProjectRepository
import kotlinx.serialization.Serializable

@Serializable
data class CreateTicketRequest(
    val projectId: Int,
    val type: String, // BUG, FEATURE, SUPPORT
    val priority: String, // NORMAL, HIGH, CRITICAL
    val description: String
)

class CreateTicketUseCase(
    private val ticketRepository: TicketRepository,
    private val projectRepository: ProjectRepository
) {
    suspend fun execute(request: CreateTicketRequest, companyId: Int, userId: Int): Int {
        // Validate project belongs to the company
        val companyProjects = projectRepository.getProjectsByCompany(companyId)
        if (companyProjects.none { it.id == request.projectId }) {
            throw IllegalArgumentException("Project does not belong to the user's company or does not exist.")
        }

        if (request.description.isBlank()) {
            throw IllegalArgumentException("Description cannot be blank")
        }
        
        val validTypes = setOf("BUG", "FEATURE", "SUPPORT")
        if (request.type !in validTypes) {
            throw IllegalArgumentException("Invalid ticket type")
        }

        val validPriorities = setOf("NORMAL", "HIGH", "CRITICAL")
        if (request.priority !in validPriorities) {
            throw IllegalArgumentException("Invalid ticket priority")
        }

        return ticketRepository.createTicket(
            projectId = request.projectId,
            createdBy = userId,
            type = request.type,
            priority = request.priority,
            description = request.description
        )
    }
}
