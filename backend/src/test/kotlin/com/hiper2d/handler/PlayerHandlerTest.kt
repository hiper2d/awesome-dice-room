package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Player
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

internal class PlayerHandlerTest: BaseTest() {

    @Test
    fun findPlayer() {
        val p1 = Player(name = "P1", userId = "123")
        val p2 = Player(name = "P2", userId = "456")

        val p1Str = mapper.writeValueAsString(p1)
        val p2Str = mapper.writeValueAsString(p2)

        val p1Res = createPlayer(p1Str)
        val p2Res = createPlayer(p2Str)

        val finalRes: MutableList<Player>? = webClient.get().uri("/api/players?ids=${p1Res?.id},${p2Res?.id}")
            .exchange()
            .returnResult(Player::class.java)
            .responseBody
            .collectList()
            .block()

        assertEquals(2, finalRes?.size)
        assertEquals(p1.userId, finalRes?.find { it.name == p1.name }?.userId)
        assertEquals(p2.name, finalRes?.find { it.userId == p2.userId }?.name)
    }

    private fun createPlayer(pStr: String): Player? {
        return webClient.post().uri("/api/players")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(pStr), String::class.java))
            .exchange()
            .returnResult(Player::class.java)
            .responseBody
            .blockFirst()
    }
}
