package com.hiper2d.auth

import com.hiper2d.auth.token.GuestAuthenticationToken
import com.hiper2d.auth.token.JwtAuthenticationToken
import com.hiper2d.auth.token.JwtPreAuthenticationToken
import com.hiper2d.repository.UserRepository
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.core.Authentication
import reactor.core.publisher.Mono

class JwtReactiveAuthenticationManager(private val userRepository: UserRepository): ReactiveAuthenticationManager {

    override fun authenticate(authentication: Authentication): Mono<Authentication> = authenticateToken(authentication)

    private fun authenticateToken(token: Authentication): Mono<Authentication> {
        return when (token) {
            is GuestAuthenticationToken -> Mono.just(token)
            is JwtPreAuthenticationToken -> personalizeToken(token)
            else -> raiseBadCredentials()
        }
    }

    private fun personalizeToken(token: JwtPreAuthenticationToken): Mono<Authentication> {
        return userRepository
            .findByName(token.username)
            .switchIfEmpty(Mono.defer(this::raiseBadCredentials))
            .map { JwtAuthenticationToken(it.username, it.authorities) as Authentication }
    }

    private fun <T> raiseBadCredentials(): Mono<T> = Mono.error(BadCredentialsException("Invalid Credentials"))
}
