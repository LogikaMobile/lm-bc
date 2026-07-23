package mx.com.logikamobile.lmbc.application.usecases

import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.domain.entities.Company
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ToggleCompanyStatusUseCaseTest {

    private val companyRepository = mockk<CompanyRepository>()
    private val toggleCompanyStatusUseCase = ToggleCompanyStatusUseCase(companyRepository)

    @Test
    fun `execute returns true when company exists and status is updated`() = runTest {
        // Arrange
        val companyId = 2
        val newStatus = false
        val existingCompany = Company(
            id = companyId,
            name = "Test Company",
            type = "CLIENT",
            supportHoursQuota = 10,
            supportHoursUsed = 0,
            primaryColor = null,
            secondaryColor = null,
            accentColor = null,
            logoPath = null,
            isActive = true,
            updatedAt = LocalDateTime.now(),
            deletedAt = null
        )

        coEvery { companyRepository.findById(companyId) } returns existingCompany
        coEvery { companyRepository.toggleCompanyStatus(companyId, newStatus) } returns true

        // Act
        val result = toggleCompanyStatusUseCase.execute(companyId, newStatus)

        // Assert
        assertTrue(result)
        coVerify(exactly = 1) { companyRepository.toggleCompanyStatus(companyId, newStatus) }
    }

    @Test
    fun `execute returns false when company does not exist`() = runTest {
        // Arrange
        val companyId = 999
        val newStatus = false

        coEvery { companyRepository.toggleCompanyStatus(companyId, newStatus) } returns false

        // Act
        val result = toggleCompanyStatusUseCase.execute(companyId, newStatus)

        // Assert
        assertFalse(result)
        coVerify(exactly = 1) { companyRepository.toggleCompanyStatus(companyId, newStatus) }
    }
}
