package mx.com.logikamobile.lmbc.application.interfaces

interface PasswordHasher {
    fun hashPassword(password: String): String
    fun verifyPassword(password: String, hash: String): Boolean
}
