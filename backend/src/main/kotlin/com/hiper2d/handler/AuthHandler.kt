package com.hiper2d.handler

import com.hiper2d.auth.JwtConfigService
import com.hiper2d.auth.model.JwtAuthenticationRequest
import com.hiper2d.model.User
import com.hiper2d.repository.UserRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import reactor.core.publisher.Mono

@Component
class AuthHandler @Autowired constructor(
    private val userRepository: UserRepository,
    private val jwtConfig: JwtConfigService,
    private val encoder: PasswordEncoder
) {

    private val logger = LoggerFactory.getLogger(javaClass)

    fun signUp(request: ServerRequest): Mono<ServerResponse> {
        return request.bodyToMono(JwtAuthenticationRequest::class.java)
            .flatMap { createUser(it) } // todo: add check if the user exists
            .flatMap {
                ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .build()
            }
            .onErrorResume {
                logger.error("Failed to create a user", it)
                ServerResponse.status(500).build()
            }
    }

    fun generateToken(request: ServerRequest): Mono<ServerResponse> {
        val user = request.bodyToMono(JwtAuthenticationRequest::class.java)
            .flatMap { findUser(it) }
            .map { generateJwtToken(it) }

        return ServerResponse.ok()
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(user, String::class.java)
    }

    private fun createUser(token: JwtAuthenticationRequest): Mono<User> =
        Mono.just(User(name = token.username, password = encoder.encode(token.password), roles = emptyList()))
            .flatMap { userRepository.insert(it) }

    private fun findUser(token: JwtAuthenticationRequest): Mono<User> =
        userRepository.findByName(token.username)
            .filter { encoder.matches(token.password, it.password) }
            .switchIfEmpty(throwUserNotFoundException())

    private fun throwUserNotFoundException(): Mono<User> =
        Mono.error(RuntimeException("Invalid credentials"))

    private fun generateJwtToken(it: UserDetails): String =
        Jwts.builder()
            .setSubject(it.username)
            .signWith(SignatureAlgorithm.HS512, jwtConfig.secret)
            .compact()
}
