package mx.com.logikamobile.lmbc.application.interfaces

import kotlinx.serialization.Serializable

@Serializable
data class ProjectMetricsDto(
    val projectId: Int,
    val name: String,
    val openTickets: Long,
    val closedTickets: Long
)

@Serializable
data class CompanyMetricsDto(
    val companyId: Int,
    val name: String,
    val projectsCount: Long,
    val openTickets: Long,
    val closedTickets: Long,
    val projects: List<ProjectMetricsDto>
)

@Serializable
data class GlobalMetricsDto(
    val projectsCount: Long,
    val openTickets: Long,
    val closedTickets: Long
)

@Serializable
data class AdminMetricsDto(
    val global: GlobalMetricsDto,
    val companies: List<CompanyMetricsDto>
)

interface AdminMetricsQueryService {
    suspend fun getAdminMetrics(): AdminMetricsDto
}
