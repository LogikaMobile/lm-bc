package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.ProjectRepository
enum class ProjectType {
    LMAAS,
    SAAS,
    VENTA_UNICA,
    HAAS
}

data class CreateProjectRequest(
    val name: String,
    val companyId: Int,
    val type: ProjectType
)

class CreateProjectUseCase(private val projectRepository: ProjectRepository) {
    suspend fun execute(request: CreateProjectRequest): Int {
        if (request.name.isBlank()) {
            throw IllegalArgumentException("Project name cannot be blank")
        }
        if (request.companyId <= 0) {
            throw IllegalArgumentException("Invalid company ID")
        }
        return projectRepository.create(request.name, request.companyId, request.type.name)
    }
}
