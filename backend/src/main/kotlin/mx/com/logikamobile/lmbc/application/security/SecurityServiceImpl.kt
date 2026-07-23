package mx.com.logikamobile.lmbc.application.security

import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.JWTVerifier
import io.github.cdimascio.dotenv.dotenv
import mx.com.logikamobile.lmbc.application.interfaces.PasswordHasher
import mx.com.logikamobile.lmbc.application.interfaces.TokenProvider
import java.util.*

class SecurityServiceImpl : PasswordHasher, TokenProvider {
    private val dotenv = dotenv { ignoreIfMissing = true }
    private val secret = dotenv["JWT_SECRET"] ?: "lmbc-secret-key-2026-super-secure"
    private val issuer = "mx.com.logikamobile"
    private val audience = "lmbc-users"
    private val expirationMs = 3600000 * 24 // 24 hours

    val algorithm: Algorithm = Algorithm.HMAC256(secret)

    override fun hashPassword(password: String): String {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray())
    }

    override fun verifyPassword(password: String, hash: String): Boolean {
        return BCrypt.verifyer().verify(password.toCharArray(), hash).verified
    }

    override fun generateJwt(userId: Int, companyId: Int, companyType: String): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(issuer)
            .withClaim("userId", userId)
            .withClaim("companyId", companyId)
            .withClaim("companyType", companyType)
            .withExpiresAt(Date(System.currentTimeMillis() + expirationMs))
            .sign(algorithm)
    }

    override fun getVerifier(): JWTVerifier = JWT.require(algorithm)
        .withAudience(audience)
        .withIssuer(issuer)
        .build()
}
