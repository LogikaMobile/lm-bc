package mx.com.logikamobile.lmbc.infrastructure.database

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import kotlinx.coroutines.Dispatchers
import mx.com.logikamobile.lmbc.infrastructure.database.tables.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import mx.com.logikamobile.lmbc.application.security.SecurityServiceImpl
import io.github.cdimascio.dotenv.dotenv

object DatabaseFactory {
    private val dotenv = dotenv { ignoreIfMissing = true }

    fun init() {
        val driverClassName = "org.postgresql.Driver"
        val jdbcURL = dotenv["DB_URL"] ?: "jdbc:postgresql://localhost:5432/lmbc"
        val database = Database.connect(hikari(driverClassName, jdbcURL))
        
        transaction(database) {
            SchemaUtils.createMissingTablesAndColumns(
                Companies,
                Users,
                Projects,
                Tickets,
                TicketMessages
            )
            seedDatabase()
        }
    }

    private fun seedDatabase() {
        val internalCompanyCount = Companies.selectAll().where { Companies.type eq "INTERNAL" }.count()
        if (internalCompanyCount == 0L) {
            val insertedCompanyId = Companies.insert {
                it[name] = "LogikaMobile"
                it[type] = "INTERNAL"
                it[supportHoursQuota] = 9999
                it[primaryColor] = "#7B2CBF"
                it[secondaryColor] = "#6CD3D3"
            } get Companies.id

            Users.insert {
                it[name] = "Admin Soporte"
                it[email] = "soporte@logikamobile.com.mx"
                it[passwordHash] = SecurityServiceImpl().hashPassword("Admin123!") // Default password
                it[companyId] = insertedCompanyId
            }
        }
    }

    private fun hikari(driverClassName: String, jdbcURL: String): HikariDataSource {
        val config = HikariConfig().apply {
            this.driverClassName = driverClassName
            this.jdbcUrl = jdbcURL
            this.username = dotenv["DB_USER"] ?: "root"
            this.password = dotenv["DB_PASSWORD"] ?: "rootpassword"
            this.maximumPoolSize = 10
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }
        return HikariDataSource(config)
    }

    suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
