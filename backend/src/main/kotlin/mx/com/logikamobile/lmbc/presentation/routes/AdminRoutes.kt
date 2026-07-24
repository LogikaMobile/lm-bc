package mx.com.logikamobile.lmbc.presentation.routes

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import mx.com.logikamobile.lmbc.application.usecases.BulkUserRequest
import mx.com.logikamobile.lmbc.application.usecases.CreateCompanyUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateUsersBulkUseCase
import mx.com.logikamobile.lmbc.application.usecases.GetAdminMetricsUseCase
import mx.com.logikamobile.lmbc.application.usecases.GetCompaniesUseCase
import mx.com.logikamobile.lmbc.application.usecases.ToggleCompanyStatusUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateProjectUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateProjectRequest
import mx.com.logikamobile.lmbc.application.usecases.ProjectType

@Serializable
data class CreateCompanyRequestDto(
    val name: String,
    val type: String,
    val supportHoursQuota: Int,
    val primaryColor: String?,
    val secondaryColor: String?,
    val accentColor: String?,
    val logoPath: String?
)

@Serializable
data class BulkUserRequestDto(
    val name: String,
    val email: String,
    val companyId: Int
)

@Serializable
data class BulkUserResponseDto(
    val createdUsersCount: Int,
    val userIds: List<Int>
)

@Serializable
data class CreateProjectRequestDto(
    val name: String,
    val companyId: Int,
    val type: ProjectType
)

@Serializable
data class ToggleCompanyStatusRequestDto(val isActive: Boolean)

@Serializable
data class AdminCompanyDto(
    val id: Int,
    val name: String,
    val type: String,
    val supportHoursQuota: Int,
    val isActive: Boolean
)

fun Route.adminRoutes(
    createCompanyUseCase: CreateCompanyUseCase,
    createUsersBulkUseCase: CreateUsersBulkUseCase,
    getAdminMetricsUseCase: GetAdminMetricsUseCase,
    getCompaniesUseCase: GetCompaniesUseCase,
    toggleCompanyStatusUseCase: ToggleCompanyStatusUseCase,
    createProjectUseCase: CreateProjectUseCase
) {
    authenticate("auth-jwt") {
        route("/api/admin") {
            
            // Interceptor to ensure only INTERNAL users can access admin routes
            intercept(ApplicationCallPipeline.Call) {
                val principal = call.principal<JWTPrincipal>()
                val role = principal?.payload?.getClaim("companyType")?.asString()
                if (role != "INTERNAL") {
                    call.respond(HttpStatusCode.Forbidden, "Requires INTERNAL role")
                    finish()
                }
            }

            post("/company") {
                try {
                    val request = call.receive<CreateCompanyRequestDto>()
                    val companyId = createCompanyUseCase.execute(
                        request.name, request.type, request.supportHoursQuota, 
                        request.primaryColor, request.secondaryColor, request.accentColor, request.logoPath
                    )
                    call.respond(HttpStatusCode.Created, mapOf("companyId" to companyId))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }

            get("/companies") {
                try {
                    val companies = getCompaniesUseCase.execute()
                    val dtoCompanies = companies.map { 
                        AdminCompanyDto(
                            id = it.id,
                            name = it.name,
                            type = it.type,
                            supportHoursQuota = it.supportHoursQuota,
                            isActive = it.isActive
                        )
                    }
                    call.respond(HttpStatusCode.OK, dtoCompanies)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Failed to fetch companies")))
                }
            }

            put("/companies/{id}/status") {
                try {
                    val id = call.parameters["id"]?.toIntOrNull() ?: throw IllegalArgumentException("Invalid ID")
                    val request = call.receive<ToggleCompanyStatusRequestDto>()
                    
                    val success = toggleCompanyStatusUseCase.execute(id, request.isActive)
                    if (success) {
                        call.respond(HttpStatusCode.OK, mapOf("success" to true))
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "Company not found"))
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }

            get("/metrics") {
                try {
                    val metrics = getAdminMetricsUseCase.execute()
                    call.respond(HttpStatusCode.OK, metrics)
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.InternalServerError, mapOf("error" to (e.message ?: "Failed to fetch metrics")))
                }
            }

            post("/projects") {
                try {
                    val requestDto = call.receive<CreateProjectRequestDto>()
                    val request = CreateProjectRequest(requestDto.name, requestDto.companyId, requestDto.type)
                    val projectId = createProjectUseCase.execute(request)
                    call.respond(HttpStatusCode.Created, mapOf("projectId" to projectId))
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }

            post("/users/bulk") {
                try {
                    val requestDto = call.receive<List<BulkUserRequestDto>>()
                    val request = requestDto.map { BulkUserRequest(it.name, it.email, it.companyId) }
                    val userIds = createUsersBulkUseCase.execute(request)
                    call.respond(HttpStatusCode.Created, BulkUserResponseDto(userIds.size, userIds))
                } catch (e: Exception) {
                    e.printStackTrace()
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid request")))
                }
            }
        }
    }
}
