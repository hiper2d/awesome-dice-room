package com.hiper2d.auth

import com.hiper2d.auth.token.GuestAuthenticationToken
import com.hiper2d.auth.token.JwtPreAuthenticationToken
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureException
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import com.hiper2d.util.filterIfNotEmpty
import com.hiper2d.util.mapIfNotEmpty
import reactor.core.publisher.switchIfEmpty

class AuthenticationTokenConverter(private val jwtConfig: JwtConfigService): ServerAuthenticationConverter {

    override fun convert(exchange: ServerWebExchange): Mono<Authentication> =
        Mono.just(exchange.request)
            .flatMap(this::extractJwtToken)
            .switchIfEmpty(Mono.just(GuestAuthenticationToken()))

    private fun extractJwtToken(request: ServerHttpRequest): Mono<Authentication> {
        return Mono.justOrEmpty(request.getTokenHeader())
            .filterIfNotEmpty { it.isToken() }
            .mapIfNotEmpty { it.getToken() }
            .flatMap { verifyAndBuildTokenObject(it)}
    }

    private fun verifyAndBuildTokenObject(stringToken: String): Mono<Authentication> =
        try {
            val claims = Jwts.parser().setSigningKey(jwtConfig.secret).parseClaimsJws(stringToken).body
            Mono.just(JwtPreAuthenticationToken(claims.subject, stringToken) as Authentication)
        } catch (ex: SignatureException) {
            ex.printStackTrace()
            Mono.error(BadCredentialsException("Invalid token"))
        }

    private fun ServerHttpRequest.getTokenHeader(): String? = this.headers.getFirst(jwtConfig.tokenHeaderName)

    private fun String.isToken() = this.startsWith(jwtConfig.bearerPrefix)

    private fun String.getToken() = this.substring(jwtConfig.bearerPrefix.length + 1)
}
