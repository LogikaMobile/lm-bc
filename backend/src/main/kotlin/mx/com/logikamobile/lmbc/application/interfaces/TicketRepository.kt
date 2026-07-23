package mx.com.logikamobile.lmbc.application.interfaces

import mx.com.logikamobile.lmbc.domain.entities.Ticket

interface TicketRepository {
    suspend fun getTickets(limit: Int, offset: Long, companyId: Int?, companyType: String): List<Ticket>
    suspend fun findById(id: Int): Ticket?
    suspend fun createTicket(projectId: Int, createdBy: Int, type: String, priority: String, description: String): Int
    suspend fun updateTicket(id: Int, status: String?, priority: String?, type: String?, description: String?, serviceHours: Int?, startedAt: java.time.LocalDateTime?, closedAt: java.time.LocalDateTime?): Boolean
}
