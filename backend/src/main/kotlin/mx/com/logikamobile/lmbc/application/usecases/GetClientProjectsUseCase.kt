package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.ProjectRepository
import mx.com.logikamobile.lmbc.domain.entities.Project
import kotlinx.serialization.Serializable

@Serializable
data class ProjectDto(
    val id: Int,
    val companyId: Int,
    val name: String,
    val type: String,
    val status: String,
    val cooldownUntil: String?
)

class GetClientProjectsUseCase(private val projectRepository: ProjectRepository) {
    suspend fun execute(companyId: Int): List<ProjectDto> {
        val projects = projectRepository.getProjectsByCompany(companyId)
        return projects.map {
            ProjectDto(
                id = it.id,
                companyId = it.companyId,
                name = it.name,
                type = it.type,
                status = it.status,
                cooldownUntil = it.cooldownUntil?.toString()
            )
        }
    }
}
