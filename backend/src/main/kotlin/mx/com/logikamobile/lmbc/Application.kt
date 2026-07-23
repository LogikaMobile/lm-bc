package mx.com.logikamobile.lmbc

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import mx.com.logikamobile.lmbc.presentation.plugins.*
import mx.com.logikamobile.lmbc.di.appModule
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun main() {
    embeddedServer(Netty, port = 8090, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    configureDatabase()
    configureSerialization()
    configureSecurity()
    configureSockets()
    configureRouting()
}
