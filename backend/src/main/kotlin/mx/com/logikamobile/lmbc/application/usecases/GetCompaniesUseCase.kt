package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository
import mx.com.logikamobile.lmbc.domain.entities.Company

class GetCompaniesUseCase(private val companyRepository: CompanyRepository) {
    suspend fun execute(): List<Company> {
        return companyRepository.getAllCompanies()
    }
}
