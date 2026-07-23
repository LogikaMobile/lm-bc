package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.UserRepository
import mx.com.logikamobile.lmbc.domain.entities.User
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Users
import mx.com.logikamobile.lmbc.application.interfaces.CreateUserDto
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.batchInsert
import org.jetbrains.exposed.sql.selectAll
import java.time.LocalDateTime

class UserRepositoryImpl : UserRepository {
    override suspend fun findByEmail(email: String): User? = dbQuery {
        Users.selectAll().where { (Users.email eq email) and Users.deletedAt.isNull() }
            .map(::rowToUser)
            .singleOrNull()
    }

    override suspend fun findById(id: Int): User? = dbQuery {
        Users.selectAll().where { (Users.id eq id) and Users.deletedAt.isNull() }
            .map(::rowToUser)
            .singleOrNull()
    }

    override suspend fun bulkCreate(users: List<CreateUserDto>): List<Int> = dbQuery {
        Users.batchInsert(users, shouldReturnGeneratedValues = true) { dto ->
            this[Users.name] = dto.name
            this[Users.email] = dto.email
            this[Users.passwordHash] = dto.passwordHash
            this[Users.companyId] = dto.companyId
            this[Users.isActive] = true
            this[Users.requiresPasswordChange] = dto.requiresPasswordChange
            this[Users.updatedAt] = LocalDateTime.now()
        }.map { it[Users.id] }
    }

    private fun rowToUser(row: ResultRow) = User(
        id = row[Users.id],
        name = row[Users.name],
        email = row[Users.email],
        passwordHash = row[Users.passwordHash],
        companyId = row[Users.companyId],
        isActive = row[Users.isActive],
        requiresPasswordChange = row[Users.requiresPasswordChange],
        updatedAt = row[Users.updatedAt],
        deletedAt = row[Users.deletedAt]
    )
}
