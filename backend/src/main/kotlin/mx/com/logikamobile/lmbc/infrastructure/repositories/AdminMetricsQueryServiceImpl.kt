package mx.com.logikamobile.lmbc.infrastructure.repositories

import mx.com.logikamobile.lmbc.application.interfaces.AdminMetricsDto
import mx.com.logikamobile.lmbc.application.interfaces.AdminMetricsQueryService
import mx.com.logikamobile.lmbc.application.interfaces.CompanyMetricsDto
import mx.com.logikamobile.lmbc.application.interfaces.GlobalMetricsDto
import mx.com.logikamobile.lmbc.application.interfaces.ProjectMetricsDto
import mx.com.logikamobile.lmbc.infrastructure.database.DatabaseFactory.dbQuery
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Companies
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Projects
import mx.com.logikamobile.lmbc.infrastructure.database.tables.Tickets
import org.jetbrains.exposed.sql.selectAll

class AdminMetricsQueryServiceImpl : AdminMetricsQueryService {
    override suspend fun getAdminMetrics(): AdminMetricsDto = dbQuery {
        val allCompanies = Companies.selectAll().where { Companies.deletedAt.isNull() }.map { 
            it[Companies.id] to it[Companies.name]
        }
        
        val allProjects = Projects.selectAll().where { Projects.deletedAt.isNull() }.map { 
            it[Projects.id] to Pair(it[Projects.companyId], it[Projects.name]) 
        }.toMap()
        
        val allTickets = Tickets.selectAll().where { Tickets.deletedAt.isNull() }.map { 
            it[Tickets.projectId] to it[Tickets.status] 
        }

        var globalProjects = 0L
        var globalOpenTickets = 0L
        var globalClosedTickets = 0L

        val companyMetricsList = allCompanies.map { comp ->
            val compProjects = allProjects.filterValues { it.first == comp.first }
            val compProjectsCount = compProjects.size.toLong()
            
            var compOpenT = 0L
            var compClosedT = 0L
            
            val projectMetricsList = compProjects.map { (projId, projData) ->
                var projOpenT = 0L
                var projClosedT = 0L
                
                allTickets.forEach { (ticketProjId, status) ->
                    if (ticketProjId == projId) {
                        if (status == "CLOSED") projClosedT++ else projOpenT++
                    }
                }
                
                compOpenT += projOpenT
                compClosedT += projClosedT
                
                ProjectMetricsDto(
                    projectId = projId,
                    name = projData.second,
                    openTickets = projOpenT,
                    closedTickets = projClosedT
                )
            }

            globalProjects += compProjectsCount
            globalOpenTickets += compOpenT
            globalClosedTickets += compClosedT

            CompanyMetricsDto(
                companyId = comp.first,
                name = comp.second,
                projectsCount = compProjectsCount,
                openTickets = compOpenT,
                closedTickets = compClosedT,
                projects = projectMetricsList
            )
        }

        AdminMetricsDto(
            global = GlobalMetricsDto(globalProjects, globalOpenTickets, globalClosedTickets),
            companies = companyMetricsList
        )
    }
}
