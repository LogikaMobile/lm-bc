package mx.com.logikamobile.lmbc.application.interfaces

import mx.com.logikamobile.lmbc.domain.entities.TicketMessage

interface TicketMessageRepository {
    suspend fun getMessagesForTicket(ticketId: Int, limit: Int, offset: Long): List<TicketMessage>
    suspend fun insertMessage(ticketId: Int, senderId: Int, message: String): TicketMessage
}
