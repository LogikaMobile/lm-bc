package mx.com.logikamobile.lmbc.infrastructure.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object Companies : Table("companies") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val type = varchar("type", 50) // CLIENT or INTERNAL
    val supportHoursQuota = integer("support_hours_quota")
    val supportHoursUsed = integer("support_hours_used").default(0)
    val primaryColor = varchar("primary_color", 7).nullable()
    val secondaryColor = varchar("secondary_color", 7).nullable()
    val accentColor = varchar("accent_color", 7).nullable()
    val logoPath = varchar("logo_path", 500).nullable()
    val isActive = bool("is_active").default(true)
    
    val updatedAt = datetime("updated_at").default(LocalDateTime.now())
    val deletedAt = datetime("deleted_at").nullable()
    
    override val primaryKey = PrimaryKey(id)
}
