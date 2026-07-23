package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository

class ToggleCompanyStatusUseCase(private val companyRepository: CompanyRepository) {
    suspend fun execute(id: Int, isActive: Boolean): Boolean {
        return companyRepository.toggleCompanyStatus(id, isActive)
    }
}
