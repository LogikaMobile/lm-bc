package mx.com.logikamobile.lmbc.presentation.plugins

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.server.application.*
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory

fun Application.configureDatabase() {
    DatabaseFactory.init()
}
