package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.AdminMetricsDto
import mx.com.logikamobile.lmbc.application.interfaces.AdminMetricsQueryService

class GetAdminMetricsUseCase(
    private val adminMetricsQueryService: AdminMetricsQueryService
) {
    suspend fun execute(): AdminMetricsDto {
        return adminMetricsQueryService.getAdminMetrics()
    }
}
