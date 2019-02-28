package com.hiper2d.model

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Document(collection = "user")
class User @JsonCreator(mode=JsonCreator.Mode.PROPERTIES) constructor(
    @Id var id: String? = null,
    @Indexed(unique = true) private val name: String,
    private val roles: List<String>,
    private val password: String
): UserDetails {

    override fun getUsername() = name

    override fun getAuthorities(): Collection<GrantedAuthority> = roles.map { SimpleGrantedAuthority(it) }

    @JsonIgnore
    override fun isEnabled() = true

    @JsonIgnore
    override fun isCredentialsNonExpired() = true

    @JsonIgnore
    override fun getPassword() = password

    @JsonIgnore
    override fun isAccountNonExpired() = true

    @JsonIgnore
    override fun isAccountNonLocked() = true
}
