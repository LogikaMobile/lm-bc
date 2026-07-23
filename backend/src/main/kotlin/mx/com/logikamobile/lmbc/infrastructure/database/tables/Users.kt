package mx.com.logikamobile.lmbc.infrastructure.database.tables

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime
import java.time.LocalDateTime

object Users : Table("users") {
    val id = integer("id").autoIncrement()
    val name = varchar("name", 255)
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val companyId = integer("company_id").references(Companies.id).index()
    val isActive = bool("is_active").default(true)
    val requiresPasswordChange = bool("requires_password_change").default(false)
    
    val updatedAt = datetime("updated_at").default(LocalDateTime.now())
    val deletedAt = datetime("deleted_at").nullable()
    
    override val primaryKey = PrimaryKey(id)
}
