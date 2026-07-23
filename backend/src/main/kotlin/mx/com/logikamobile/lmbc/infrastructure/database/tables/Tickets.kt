package mx.com.logikamobile.lmbc.infrastructure.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object Tickets : Table("tickets") {
    val id = integer("id").autoIncrement()
    val projectId = integer("project_id").references(Projects.id).index()
    val createdBy = integer("created_by").references(Users.id).index()
    val type = varchar("type", 50) // BUG, FEATURE, SUPPORT
    val status = varchar("status", 50) // OPEN, CLOSED, BLOCKED, IN_PROGRESS
    val priority = varchar("priority", 50) // NORMAL, HIGH
    val description = text("description")
    val serviceHours = integer("service_hours").nullable()
    val startedAt = datetime("started_at").nullable()
    val closedAt = datetime("closed_at").nullable()
    
    val createdAt = datetime("created_at").default(LocalDateTime.now())
    val updatedAt = datetime("updated_at").default(LocalDateTime.now())
    val deletedAt = datetime("deleted_at").nullable()
    
    override val primaryKey = PrimaryKey(id)
}
