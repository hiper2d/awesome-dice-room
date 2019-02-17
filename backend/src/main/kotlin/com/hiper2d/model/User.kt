package com.hiper2d.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Document(collection = "user")
class User @JsonCreator(mode=JsonCreator.Mode.PROPERTIES) constructor(
    @Id val id: String? = null,
    private val name: String,
    private val password: String,
    private val roles: List<String>
): UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> = roles.map { SimpleGrantedAuthority(it) }

    override fun isEnabled() = true

    override fun getUsername() = name

    override fun isCredentialsNonExpired() = true

    @JsonIgnore
    override fun getPassword() = password

    override fun isAccountNonExpired() = true

    override fun isAccountNonLocked() = true
}
