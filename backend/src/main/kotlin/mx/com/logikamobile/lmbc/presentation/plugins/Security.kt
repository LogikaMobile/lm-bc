package mx.com.logikamobile.lmbc.presentation.plugins

import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import mx.com.logikamobile.lmbc.application.interfaces.TokenProvider
import org.koin.core.context.GlobalContext

fun Application.configureSecurity() {
    val tokenProvider = GlobalContext.get().get<TokenProvider>()
    install(Authentication) {
        jwt("auth-jwt") {
            realm = "LogikaMobile Business Center"
            verifier(tokenProvider.getVerifier())
            validate { credential ->
                if (credential.payload.getClaim("userId").asInt() != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }
}
