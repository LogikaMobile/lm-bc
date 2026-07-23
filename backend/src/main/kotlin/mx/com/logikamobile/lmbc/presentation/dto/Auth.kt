package mx.com.logikamobile.lmbc.presentation.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val token: String,
    val user: UserDto,
    val company: CompanyDto
)

@Serializable
data class UserDto(
    val id: Int,
    val name: String,
    val email: String,
    val companyId: Int
)

@Serializable
data class CompanyDto(
    val id: Int,
    val name: String,
    val type: String,
    val primaryColor: String?,
    val secondaryColor: String?
)
