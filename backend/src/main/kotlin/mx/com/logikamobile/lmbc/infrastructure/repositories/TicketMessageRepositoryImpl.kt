package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.TicketMessageRepository
import mx.com.logikamobile.lmbc.domain.entities.TicketMessage
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.TicketMessages
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Users
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

class TicketMessageRepositoryImpl : TicketMessageRepository {
    override suspend fun getMessagesForTicket(ticketId: Int, limit: Int, offset: Long): List<TicketMessage> = dbQuery {
        TicketMessages.innerJoin(Users)
            .selectAll()
            .where { (TicketMessages.ticketId eq ticketId) and TicketMessages.deletedAt.isNull() }
            .orderBy(TicketMessages.timestamp to SortOrder.DESC)
            .limit(limit, offset)
            .map(::rowToTicketMessage)
    }

    override suspend fun insertMessage(ticketId: Int, senderId: Int, message: String): TicketMessage = dbQuery {
        val insertedId = TicketMessages.insert {
            it[this.ticketId] = ticketId
            it[this.senderId] = senderId
            it[this.message] = message
        } get TicketMessages.id

        TicketMessages.innerJoin(Users)
            .selectAll()
            .where { TicketMessages.id eq insertedId }
            .map(::rowToTicketMessage)
            .single()
    }

    private fun rowToTicketMessage(row: ResultRow) = TicketMessage(
        id = row[TicketMessages.id],
        ticketId = row[TicketMessages.ticketId],
        senderId = row[TicketMessages.senderId],
        senderName = row[Users.name],
        message = row[TicketMessages.message],
        timestamp = row[TicketMessages.timestamp],
        updatedAt = row[TicketMessages.updatedAt],
        deletedAt = row[TicketMessages.deletedAt]
    )
}
