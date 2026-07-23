package mx.com.logikamobile.lmbc.infrastructure.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object TicketMessages : Table("ticketmessages") {
    val id = integer("id").autoIncrement()
    val ticketId = integer("ticket_id").references(Tickets.id).index()
    val senderId = integer("sender_id").references(Users.id).index()
    val message = text("message")
    
    val timestamp = datetime("timestamp").default(LocalDateTime.now())
    val updatedAt = datetime("updated_at").default(LocalDateTime.now())
    val deletedAt = datetime("deleted_at").nullable()
    
    override val primaryKey = PrimaryKey(id)
}
