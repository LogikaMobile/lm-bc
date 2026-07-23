package mx.com.logikamobile.lmbc.presentation.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import mx.com.logikamobile.lmbc.presentation.routes.authRoutes
import mx.com.logikamobile.lmbc.presentation.routes.ticketRoutes
import mx.com.logikamobile.lmbc.presentation.routes.adminRoutes
import org.koin.core.context.GlobalContext

fun Application.configureRouting() {
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        anyHost() // Only for development
    }

    routing {
        get("/") {
            call.respondText("LMBC API Running")
        }
        
        authRoutes()
        ticketRoutes()
        
        val koin = GlobalContext.get()
        
        adminRoutes(
            createCompanyUseCase = koin.get(),
            createUsersBulkUseCase = koin.get(),
            getAdminMetricsUseCase = koin.get(),
            getCompaniesUseCase = koin.get(),
            toggleCompanyStatusUseCase = koin.get(),
            createProjectUseCase = koin.get()
        )
    }
}
