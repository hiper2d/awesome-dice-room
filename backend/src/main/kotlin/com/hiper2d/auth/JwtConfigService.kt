package com.hiper2d.auth

import org.springframework.beans.factory.annotation.Value

class JwtConfigService {

    @Value("\${jwt.header}")
    lateinit var tokenHeaderName: String

    @Value("\${jwt.prefix}")
    lateinit var bearerPrefix: String

    @Value("\${jwt.secret}")
    lateinit var secret: String
}
