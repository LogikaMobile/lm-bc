package mx.com.logikamobile.lmbc.di

import mx.com.logikamobile.lmbc.application.interfaces.*
import mx.com.logikamobile.lmbc.application.security.SecurityServiceImpl
import mx.com.logikamobile.lmbc.application.usecases.GetTicketsUseCase
import mx.com.logikamobile.lmbc.application.usecases.LoginUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateCompanyUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateProjectUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateUsersBulkUseCase
import mx.com.logikamobile.lmbc.application.usecases.GetAdminMetricsUseCase
import mx.com.logikamobile.lmbc.application.usecases.GetClientProjectsUseCase
import mx.com.logikamobile.lmbc.application.usecases.GetCompaniesUseCase
import mx.com.logikamobile.lmbc.application.usecases.ToggleCompanyStatusUseCase
import mx.com.logikamobile.lmbc.application.usecases.CreateTicketUseCase
import mx.com.logikamobile.lmbc.application.usecases.UpdateTicketUseCase
import mx.com.logikamobile.lmbc.infrastructure.repositories.*
import org.koin.dsl.module

val appModule = module {
    // Repositories
    single<UserRepository> { UserRepositoryImpl() }
    single<CompanyRepository> { CompanyRepositoryImpl() }
    single<ProjectRepository> { ProjectRepositoryImpl() }
    single<TicketRepository> { TicketRepositoryImpl() }
    single<TicketMessageRepository> { TicketMessageRepositoryImpl() }
    single<AdminMetricsQueryService> { AdminMetricsQueryServiceImpl() }

    // Security
    val securityService = SecurityServiceImpl()
    single<PasswordHasher> { securityService }
    single<TokenProvider> { securityService }
    single { securityService } // Inject concrete type if needed by Security plugin

    // Use Cases
    single { LoginUseCase(get(), get(), get(), get()) }
    single { GetTicketsUseCase(get()) }
    single { CreateCompanyUseCase(get()) }
    single { CreateProjectUseCase(get()) }
    single { CreateUsersBulkUseCase(get(), get()) }
    single { GetAdminMetricsUseCase(get()) }
    single { GetClientProjectsUseCase(get()) }
    single { CreateTicketUseCase(get(), get()) }
    single { GetCompaniesUseCase(get()) }
    single { ToggleCompanyStatusUseCase(get()) }
    single { UpdateTicketUseCase(get()) }
}
