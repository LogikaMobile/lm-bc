package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.TicketRepository
import mx.com.logikamobile.lmbc.domain.entities.Ticket
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Projects
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Tickets
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.update

class TicketRepositoryImpl : TicketRepository {
    override suspend fun getTickets(limit: Int, offset: Long, companyId: Int?, companyType: String): List<Ticket> = dbQuery {
        val query = if (companyType == "INTERNAL") {
            Tickets.selectAll().where { Tickets.deletedAt.isNull() }
        } else {
            // Join Projects to verify companyId
            (Tickets innerJoin Projects).selectAll().where {
                (Projects.companyId eq companyId!!) and Tickets.deletedAt.isNull() and Projects.deletedAt.isNull()
            }
        }
        
        query.limit(limit, offset).map(::rowToTicket)
    }

    override suspend fun findById(id: Int): Ticket? = dbQuery {
        Tickets.selectAll().where { (Tickets.id eq id) and Tickets.deletedAt.isNull() }
            .map(::rowToTicket)
            .singleOrNull()
    }

    private fun rowToTicket(row: ResultRow) = Ticket(
        id = row[Tickets.id],
        projectId = row[Tickets.projectId],
        createdBy = row[Tickets.createdBy],
        type = row[Tickets.type],
        status = row[Tickets.status],
        priority = row[Tickets.priority],
        description = row[Tickets.description],
        serviceHours = row[Tickets.serviceHours],
        startedAt = row[Tickets.startedAt],
        closedAt = row[Tickets.closedAt],
        createdAt = row[Tickets.createdAt],
        updatedAt = row[Tickets.updatedAt],
        deletedAt = row[Tickets.deletedAt]
    )

    override suspend fun createTicket(projectId: Int, createdBy: Int, type: String, priority: String, description: String): Int = dbQuery {
        Tickets.insert {
            it[Tickets.projectId] = projectId
            it[Tickets.createdBy] = createdBy
            it[Tickets.type] = type
            it[Tickets.status] = "OPEN"
            it[Tickets.priority] = priority
            it[Tickets.description] = description
            it[Tickets.createdAt] = java.time.LocalDateTime.now()
            it[Tickets.updatedAt] = java.time.LocalDateTime.now()
        }[Tickets.id]
    }

    override suspend fun updateTicket(
        id: Int,
        status: String?,
        priority: String?,
        type: String?,
        description: String?,
        serviceHours: Int?,
        startedAt: java.time.LocalDateTime?,
        closedAt: java.time.LocalDateTime?
    ): Boolean = dbQuery {
        Tickets.update({ Tickets.id eq id }) {
            status?.let { st -> it[Tickets.status] = st }
            priority?.let { pr -> it[Tickets.priority] = pr }
            type?.let { ty -> it[Tickets.type] = ty }
            description?.let { desc -> it[Tickets.description] = desc }
            serviceHours?.let { sh -> it[Tickets.serviceHours] = sh }
            startedAt?.let { sa -> it[Tickets.startedAt] = sa }
            closedAt?.let { ca -> it[Tickets.closedAt] = ca }
            it[Tickets.updatedAt] = java.time.LocalDateTime.now()
        } > 0
    }
}
