package com.hiper2d.handler

import com.hiper2d.auth.JwtConfigService
import com.hiper2d.auth.model.JwtAuthenticationRequest
import com.hiper2d.model.User
import com.hiper2d.repository.UserRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
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

    fun signUp(request: ServerRequest): Mono<ServerResponse> {
        return request.bodyToMono(JwtAuthenticationRequest::class.java)
            .flatMap { createUser(it) }
            .flatMap {
                ServerResponse.ok()
                    .contentType(MediaType.APPLICATION_JSON_UTF8)
                    .build()
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
        userRepository.insert(User(
            name = token.username,
            password = encoder.encode(token.password),
            roles = emptyList()
        )).onErrorResume { Mono.error(RuntimeException("User already exists")) }

    private fun findUser(token: JwtAuthenticationRequest): Mono<User> =
        userRepository.findByName(token.username)
            .filter { encoder.matches(token.password, it.password) }
            .switchIfEmpty(Mono.error(RuntimeException("Invalid credentials")))

    private fun generateJwtToken(it: UserDetails): String =
        Jwts.builder()
            .setSubject(it.username)
            .signWith(SignatureAlgorithm.HS512, jwtConfig.secret)
            .compact()
}
