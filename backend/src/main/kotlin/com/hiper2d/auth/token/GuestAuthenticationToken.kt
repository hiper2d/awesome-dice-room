package com.hiper2d.auth.token

import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.core.GrantedAuthority

class GuestAuthenticationToken(
    authorities: List<GrantedAuthority> = emptyList(),
    private val username: String = "anonymous"
): AbstractAuthenticationToken(authorities) {

    init {
        isAuthenticated = true
    }

    override fun getCredentials(): Any = ""

    override fun getPrincipal(): Any = username
}
