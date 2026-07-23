package mx.com.logikamobile.lmbc.application.interfaces

import mx.com.logikamobile.lmbc.domain.entities.User

data class CreateUserDto(
    val name: String,
    val email: String,
    val passwordHash: String,
    val companyId: Int,
    val requiresPasswordChange: Boolean
)

interface UserRepository {
    suspend fun findByEmail(email: String): User?
    suspend fun findById(id: Int): User?
    suspend fun bulkCreate(users: List<CreateUserDto>): List<Int>
}
