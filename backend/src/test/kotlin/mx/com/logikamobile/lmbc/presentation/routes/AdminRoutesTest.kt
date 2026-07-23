package mx.com.logikamobile.lmbc.presentation.routes

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.serialization.json.Json
import mx.com.logikamobile.lmbc.application.security.SecurityServiceImpl
import mx.com.logikamobile.lmbc.application.usecases.*
import mx.com.logikamobile.lmbc.presentation.plugins.configureRouting
import mx.com.logikamobile.lmbc.presentation.plugins.configureSecurity
import mx.com.logikamobile.lmbc.presentation.plugins.configureSerialization
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.module
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AdminRoutesTest {

    private val createCompanyUseCase = mockk<CreateCompanyUseCase>()
    private val getCompaniesUseCase = mockk<GetCompaniesUseCase>()
    private val toggleCompanyStatusUseCase = mockk<ToggleCompanyStatusUseCase>()
    private val createProjectUseCase = mockk<CreateProjectUseCase>()
    private val createUsersBulkUseCase = mockk<CreateUsersBulkUseCase>()
    private val getAdminMetricsUseCase = mockk<GetAdminMetricsUseCase>()
    private val securityService = SecurityServiceImpl()

    @BeforeTest
    fun setup() {
        stopKoin()
        startKoin {
            modules(module {
                single { createCompanyUseCase }
                single { getCompaniesUseCase }
                single { toggleCompanyStatusUseCase }
                single { createProjectUseCase }
                single { createUsersBulkUseCase }
                single { getAdminMetricsUseCase }
                single<mx.com.logikamobile.lmbc.application.interfaces.TokenProvider> { securityService }
            })
        }
    }

    @AfterTest
    fun teardown() {
        stopKoin()
    }

    @Test
    fun `POST to admin company returns 201 Created`() = testApplication {
        application {
            configureSerialization()
            configureSecurity()
            routing {
                adminRoutes(
                    createCompanyUseCase = createCompanyUseCase,
                    createUsersBulkUseCase = createUsersBulkUseCase,
                    getAdminMetricsUseCase = getAdminMetricsUseCase,
                    getCompaniesUseCase = getCompaniesUseCase,
                    toggleCompanyStatusUseCase = toggleCompanyStatusUseCase,
                    createProjectUseCase = createProjectUseCase
                )
            }
        }

        // Generate a valid INTERNAL token
        val token = securityService.generateJwt(1, 1, "INTERNAL")

        coEvery { createCompanyUseCase.execute(any(), any(), any(), any(), any(), any(), any()) } returns 5

        val response = client.post("/api/admin/company") {
            header(HttpHeaders.Authorization, "Bearer $token")
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""
                {
                    "name": "New Test Company",
                    "type": "CLIENT",
                    "supportHoursQuota": 50,
                    "primaryColor": null,
                    "secondaryColor": null,
                    "accentColor": null,
                    "logoPath": null
                }
            """.trimIndent())
        }

        val body = response.bodyAsText()
        assertEquals(HttpStatusCode.Created, response.status, "Response was: $body")
        assertTrue(body.contains("5"), "Body didn't contain 5: $body")
    }

    @Test
    fun `POST to admin company returns 403 Forbidden for non-internal users`() = testApplication {
        application {
            configureSerialization()
            configureSecurity()
            routing {
                adminRoutes(
                    createCompanyUseCase = createCompanyUseCase,
                    createUsersBulkUseCase = createUsersBulkUseCase,
                    getAdminMetricsUseCase = getAdminMetricsUseCase,
                    getCompaniesUseCase = getCompaniesUseCase,
                    toggleCompanyStatusUseCase = toggleCompanyStatusUseCase,
                    createProjectUseCase = createProjectUseCase
                )
            }
        }

        // Generate a CLIENT token
        val token = securityService.generateJwt(2, 2, "CLIENT")

        val response = client.post("/api/admin/company") {
            header(HttpHeaders.Authorization, "Bearer $token")
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""
                {
                    "name": "Should Fail",
                    "type": "CLIENT",
                    "supportHoursQuota": 50,
                    "primaryColor": null,
                    "secondaryColor": null,
                    "accentColor": null,
                    "logoPath": null
                }
            """.trimIndent())
        }

        assertEquals(HttpStatusCode.Forbidden, response.status)
    }
}
