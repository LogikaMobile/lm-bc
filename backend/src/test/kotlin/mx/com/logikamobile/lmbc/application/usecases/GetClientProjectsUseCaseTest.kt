package mx.com.logikamobile.lmbc.application.usecases

import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import mx.com.logikamobile.lmbc.application.interfaces.ProjectRepository
import mx.com.logikamobile.lmbc.domain.entities.Project
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class GetClientProjectsUseCaseTest {

    private val projectRepository = mockk<ProjectRepository>()
    private val getClientProjectsUseCase = GetClientProjectsUseCase(projectRepository)

    @Test
    fun `execute returns list of projects for the given company`() = runTest {
        // Arrange
        val companyId = 1
        val projects = listOf(
            Project(
                id = 1,
                companyId = companyId,
                name = "Project A",
                type = "APP",
                status = "ACTIVE",
                cooldownUntil = null,
                updatedAt = LocalDateTime.now(),
                deletedAt = null
            ),
            Project(
                id = 2,
                companyId = companyId,
                name = "Project B",
                type = "WEB",
                status = "ACTIVE",
                cooldownUntil = null,
                updatedAt = LocalDateTime.now(),
                deletedAt = null
            )
        )

        coEvery { projectRepository.getProjectsByCompany(companyId) } returns projects

        // Act
        val result = getClientProjectsUseCase.execute(companyId)

        // Assert
        assertEquals(2, result.size)
        assertEquals("Project A", result[0].name)
        assertEquals("Project B", result[1].name)
    }

    @Test
    fun `execute returns empty list if no projects exist`() = runTest {
        // Arrange
        val companyId = 2
        coEvery { projectRepository.getProjectsByCompany(companyId) } returns emptyList()

        // Act
        val result = getClientProjectsUseCase.execute(companyId)

        // Assert
        assertTrue(result.isEmpty())
    }
}
