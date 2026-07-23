package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.ProjectRepository
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Projects
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.and
import java.time.LocalDateTime
import mx.com.logikamobile.lmbc.domain.entities.Project

class ProjectRepositoryImpl : ProjectRepository {
    override suspend fun create(name: String, companyId: Int, type: String): Int = dbQuery {
        Projects.insert {
            it[Projects.name] = name
            it[Projects.companyId] = companyId
            it[Projects.type] = type
            it[Projects.status] = "OPEN"
            it[Projects.updatedAt] = LocalDateTime.now()
        }[Projects.id]
    }
    
    override suspend fun getProjectsByCompany(companyId: Int): List<Project> = dbQuery {
        Projects.selectAll().where { (Projects.companyId eq companyId) and Projects.deletedAt.isNull() }
            .map { row ->
                Project(
                    id = row[Projects.id],
                    companyId = row[Projects.companyId],
                    name = row[Projects.name],
                    type = row[Projects.type],
                    status = row[Projects.status],
                    cooldownUntil = row[Projects.cooldownUntil],
                    updatedAt = row[Projects.updatedAt],
                    deletedAt = row[Projects.deletedAt]
                )
            }
    }
}
