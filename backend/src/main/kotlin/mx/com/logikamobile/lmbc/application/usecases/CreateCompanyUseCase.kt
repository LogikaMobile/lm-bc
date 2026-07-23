package mx.com.logikamobile.lmbc.application.usecases

import mx.com.logikamobile.lmbc.application.interfaces.CompanyRepository

class CreateCompanyUseCase(
    private val companyRepository: CompanyRepository
) {
    suspend fun execute(name: String, type: String, supportHoursQuota: Int, primaryColor: String?, secondaryColor: String?, accentColor: String?, logoPath: String?): Int {
        if (name.isBlank()) throw IllegalArgumentException("Company name cannot be blank")
        if (type.isBlank()) throw IllegalArgumentException("Company type cannot be blank")
        if (supportHoursQuota < 0) throw IllegalArgumentException("Support hours quota cannot be negative")

        return companyRepository.create(name, type, supportHoursQuota, primaryColor, secondaryColor, accentColor, logoPath)
    }
}
