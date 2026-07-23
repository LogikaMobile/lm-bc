package mx.com.logikamobile.lmbc.application.interfaces

import com.auth0.jwt.interfaces.JWTVerifier

interface TokenProvider {
    fun generateJwt(userId: Int, companyId: Int, companyType: String): String
    fun getVerifier(): JWTVerifier
}
