package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.application.interfaces.PasswordHasher
import mx.com.logikamobile.lmbc.application.interfaces.TokenProvider
import mx.com.logikamobile.lmbc.application.interfaces.UserRepository
import mx.com.logikamobile.lmbc.presentation.routes.UserDto
import mx.com.logikamobile.lmbc.presentation.routes.CompanyDto

import kotlinx.serialization.Serializable

@Serializable
data class LoginResult(
    val token: String,
    val user: UserDto,
    val company: CompanyDto
)

class LoginUseCase(
    private val userRepository: UserRepository,
    private val companyRepository: CompanyRepository,
    private val passwordHasher: PasswordHasher,
    private val tokenProvider: TokenProvider
) {
    suspend fun execute(email: String, passwordRaw: String): LoginResult? {
        val user = userRepository.findByEmail(email)
        if (user == null) {
            println("Login failed: User not found for email $email")
            return null
        }
        
        if (!passwordHasher.verifyPassword(passwordRaw, user.passwordHash)) {
            println("Login failed: Password hash mismatch for email $email")
            return null
        }

        val company = companyRepository.findById(user.companyId)
        if (company == null) {
            println("Login failed: Company ID ${user.companyId} not found for user $email")
            return null
        }
        
        if (!company.isActive) {
            println("Login failed: Company ID ${user.companyId} is inactive for user $email")
            return null
        }
        
        val token = tokenProvider.generateJwt(user.id, company.id, company.type)

        return LoginResult(
            token = token,
            user = UserDto(user.id, user.name, user.email),
            company = CompanyDto(
                id = company.id, 
                name = company.name, 
                type = company.type,
                primaryColor = company.primaryColor,
                secondaryColor = company.secondaryColor,
                accentColor = company.accentColor,
                logoPath = company.logoPath
            )
        )
    }
}
