package mx.com.logikamobile.lmbc.infrastructure.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object Projects : Table("projects") {
    val id = integer("id").autoIncrement()
    val companyId = integer("company_id").references(Companies.id).index()
    val name = varchar("name", 255)
    val type = varchar("type", 50).default("LMAAS")
    val status = varchar("status", 50) // OPEN, CLOSED
    val cooldownUntil = datetime("cooldown_until").nullable()
    
    val updatedAt = datetime("updated_at").default(LocalDateTime.now())
    val deletedAt = datetime("deleted_at").nullable()
    
    override val primaryKey = PrimaryKey(id)
}
