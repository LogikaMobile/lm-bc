package mx.com.logikamobile.lmbc.application.interfaces

import mx.com.logikamobile.lmbc.domain.entities.Project

interface ProjectRepository {
    suspend fun create(name: String, companyId: Int, type: String): Int
    suspend fun getProjectsByCompany(companyId: Int): List<Project>
}
