package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.CreateUserDto
import mx.com.logikamobile.lmbc.application.interfaces.PasswordHasher
import mx.com.logikamobile.lmbc.application.interfaces.UserRepository

data class BulkUserRequest(
    val name: String,
    val email: String,
    val companyId: Int
)

class CreateUsersBulkUseCase(
    private val userRepository: UserRepository,
    private val passwordHasher: PasswordHasher
) {
    suspend fun execute(users: List<BulkUserRequest>): List<Int> {
        if (users.isEmpty()) throw IllegalArgumentException("User list cannot be empty")

        // The default password requested by the user is "Mexico20"
        val defaultPasswordHash = passwordHasher.hashPassword("Mexico20")

        val createDtos = users.map { req ->
            if (req.name.isBlank()) throw IllegalArgumentException("Name cannot be blank")
            if (req.email.isBlank() || !req.email.contains("@")) throw IllegalArgumentException("Invalid email")
            
            CreateUserDto(
                name = req.name,
                email = req.email,
                passwordHash = defaultPasswordHash,
                companyId = req.companyId,
                requiresPasswordChange = true // Force user to change password on first login
            )
        }

        return userRepository.bulkCreate(createDtos)
    }
}
