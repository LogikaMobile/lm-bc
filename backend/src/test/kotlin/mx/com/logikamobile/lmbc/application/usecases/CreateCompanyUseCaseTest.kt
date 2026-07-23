package mx.com.logikamobile.lmbc.application.usecases

import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.domain.entities.Company
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals

class CreateCompanyUseCaseTest {

    private val companyRepository = mockk<CompanyRepository>()
    private val createCompanyUseCase = CreateCompanyUseCase(companyRepository)

    @Test
    fun `execute saves and returns the new company id`() = runTest {
        // Arrange
        val name = "New Client"
        val type = "CLIENT"
        val supportHoursQuota = 20
        val primaryColor = "#FF0000"
        val secondaryColor = "#00FF00"
        val accentColor = "#0000FF"
        val logoPath = "/logos/new.png"
        
        val newCompanyId = 5
        
        coEvery { companyRepository.create(name, type, supportHoursQuota, primaryColor, secondaryColor, accentColor, logoPath) } returns newCompanyId

        // Act
        val result = createCompanyUseCase.execute(name, type, supportHoursQuota, primaryColor, secondaryColor, accentColor, logoPath)

        // Assert
        assertEquals(newCompanyId, result)
    }
}
