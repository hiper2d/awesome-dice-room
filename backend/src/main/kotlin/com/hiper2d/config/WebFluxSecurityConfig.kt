package com.hiper2d.config

import com.hiper2d.auth.AuthenticationTokenConverter
import com.hiper2d.auth.JwtConfigService
import com.hiper2d.auth.JwtReactiveAuthenticationManager
import com.hiper2d.auth.filter.JwtAuthenticationWebFilter
import com.hiper2d.repository.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter

@Configuration
@EnableWebFluxSecurity
class WebFluxSecurityConfig constructor(private val userRepository: UserRepository) {

    @Bean fun jwtConfig() = JwtConfigService()

    @Bean fun authenticationTokenConverter(): ServerAuthenticationConverter = AuthenticationTokenConverter(jwtConfig())

    @Bean fun authenticationManager() = JwtReactiveAuthenticationManager(userRepository)

    @Bean
    fun jwtAuthenticationWebFilter() = JwtAuthenticationWebFilter(authenticationManager(), authenticationTokenConverter())

    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http.authorizeExchange()
            .anyExchange().authenticated()
            .and()
            .addFilterAt(jwtAuthenticationWebFilter(), SecurityWebFiltersOrder.AUTHENTICATION)
            .formLogin().disable()
            .httpBasic().disable()
            .csrf().disable()
            .build()
    }
}
