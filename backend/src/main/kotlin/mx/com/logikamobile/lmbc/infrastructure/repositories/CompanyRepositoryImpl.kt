package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.domain.entities.Company
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Companies
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Projects
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Tickets

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.update
import java.time.LocalDateTime

class CompanyRepositoryImpl : CompanyRepository {
    override suspend fun findById(id: Int): Company? = dbQuery {
        Companies.selectAll().where { (Companies.id eq id) and Companies.deletedAt.isNull() }
            .map(::rowToCompany)
            .singleOrNull()
    }

    override suspend fun create(name: String, type: String, supportHoursQuota: Int, primaryColor: String?, secondaryColor: String?, accentColor: String?, logoPath: String?): Int = dbQuery {
        Companies.insert {
            it[Companies.name] = name
            it[Companies.type] = type
            it[Companies.supportHoursQuota] = supportHoursQuota
            it[Companies.supportHoursUsed] = 0
            it[Companies.primaryColor] = primaryColor
            it[Companies.secondaryColor] = secondaryColor
            it[Companies.accentColor] = accentColor
            it[Companies.logoPath] = logoPath
            it[Companies.updatedAt] = LocalDateTime.now()
        }[Companies.id]
    }



    override suspend fun getAllCompanies(): List<Company> = dbQuery {
        Companies.selectAll()
            .where { Companies.deletedAt.isNull() }
            .map(::rowToCompany)
    }

    override suspend fun toggleCompanyStatus(id: Int, isActive: Boolean): Boolean = dbQuery {
        val rows = Companies.update({ Companies.id eq id }) {
            it[Companies.isActive] = isActive
            it[Companies.updatedAt] = LocalDateTime.now()
        }
        rows > 0
    }

    private fun rowToCompany(row: ResultRow) = Company(
        id = row[Companies.id],
        name = row[Companies.name],
        type = row[Companies.type],
        supportHoursQuota = row[Companies.supportHoursQuota],
        supportHoursUsed = row[Companies.supportHoursUsed],
        primaryColor = row[Companies.primaryColor],
        secondaryColor = row[Companies.secondaryColor],
        accentColor = row[Companies.accentColor],
        logoPath = row[Companies.logoPath],
        isActive = row[Companies.isActive],
        updatedAt = row[Companies.updatedAt],
        deletedAt = row[Companies.deletedAt]
    )
}
