package mx.com.logikamobile.lmbc.application.usecases

import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.application.interfaces.PasswordHasher
import mx.com.logikamobile.lmbc.application.interfaces.TokenProvider
import mx.com.logikamobile.lmbc.application.interfaces.UserRepository
import mx.com.logikamobile.lmbc.domain.entities.Company
import mx.com.logikamobile.lmbc.domain.entities.User
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class LoginUseCaseTest {

    private val userRepository = mockk<UserRepository>()
    private val companyRepository = mockk<CompanyRepository>()
    private val passwordHasher = mockk<PasswordHasher>()
    private val tokenProvider = mockk<TokenProvider>()

    private val loginUseCase = LoginUseCase(
        userRepository,
        companyRepository,
        passwordHasher,
        tokenProvider
    )

    @Test
    fun `execute returns LoginResult when credentials are valid`() = runTest {
        // Arrange
        val email = "soporte@logikamobile.com.mx"
        val passwordRaw = "password123"
        val passwordHash = "hashed_password"
        
        val user = User(
            id = 1,
            email = email,
            passwordHash = passwordHash,
            name = "Soporte Admin",
            companyId = 1,
            isActive = true,
            requiresPasswordChange = false,
            updatedAt = LocalDateTime.now(),
            deletedAt = null
        )

        val company = Company(
            id = 1,
            name = "LogikaMobile Internal",
            type = "INTERNAL",
            supportHoursQuota = 9999,
            supportHoursUsed = 0,
            primaryColor = null,
            secondaryColor = null,
            accentColor = null,
            logoPath = null,
            isActive = true,
            updatedAt = LocalDateTime.now(),
            deletedAt = null
        )

        coEvery { userRepository.findByEmail(email) } returns user
        coEvery { passwordHasher.verifyPassword(passwordRaw, passwordHash) } returns true
        coEvery { companyRepository.findById(user.companyId) } returns company
        coEvery { tokenProvider.generateJwt(user.id, company.id, company.type) } returns "fake_jwt_token"

        // Act
        val result = loginUseCase.execute(email, passwordRaw)

        // Assert
        assertNotNull(result)
        assertEquals("fake_jwt_token", result.token)
        assertEquals(user.id, result.user.id)
        assertEquals(company.id, result.company.id)
    }

    @Test
    fun `execute returns null when user is not found`() = runTest {
        // Arrange
        val email = "unknown@logikamobile.com.mx"
        
        coEvery { userRepository.findByEmail(email) } returns null

        // Act
        val result = loginUseCase.execute(email, "password123")

        // Assert
        assertNull(result)
    }

    @Test
    fun `execute returns null when password is invalid`() = runTest {
        // Arrange
        val email = "soporte@logikamobile.com.mx"
        val passwordRaw = "wrongpassword"
        val passwordHash = "hashed_password"
        
        val user = User(
            id = 1,
            email = email,
            passwordHash = passwordHash,
            name = "Soporte Admin",
            companyId = 1,
            isActive = true,
            requiresPasswordChange = false,
            updatedAt = LocalDateTime.now(),
            deletedAt = null
        )

        coEvery { userRepository.findByEmail(email) } returns user
        coEvery { passwordHasher.verifyPassword(passwordRaw, passwordHash) } returns false

        // Act
        val result = loginUseCase.execute(email, passwordRaw)

        // Assert
        assertNull(result)
    }
}
