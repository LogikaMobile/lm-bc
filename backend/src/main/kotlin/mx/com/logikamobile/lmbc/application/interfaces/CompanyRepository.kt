package mx.com.logikamobile.lmbc.application.interfaces

import mx.com.logikamobile.lmbc.domain.entities.Company

interface CompanyRepository {
    suspend fun findById(id: Int): Company?
    suspend fun create(name: String, type: String, supportHoursQuota: Int, primaryColor: String?, secondaryColor: String?, accentColor: String?, logoPath: String?): Int
    suspend fun getAllCompanies(): List<Company>
    suspend fun toggleCompanyStatus(id: Int, isActive: Boolean): Boolean
}
