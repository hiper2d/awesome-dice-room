package com.hiper2d.repository

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.hiper2d.model.User
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@AutoConfigureWebTestClient
@ExtendWith(SpringExtension::class)
@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private lateinit var userRepository: UserRepository

    private val mapper = ObjectMapper().registerKotlinModule()

    @Test
    fun test() {
        val user = userRepository.insert(User(name = "hiper2d", password = "123", roles = emptyList()))
            .then(userRepository.findByName("hiper2d"))
            .block()

        assertEquals("hiper2d", user?.username)
        assertEquals("123", user?.password)

        val userStr = mapper.writeValueAsString(user)
        assertFalse(userStr.contains("123"))
    }
}
