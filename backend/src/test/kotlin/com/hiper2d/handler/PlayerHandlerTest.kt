package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Inventory
import com.hiper2d.model.InventoryItem
import com.hiper2d.model.Player
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

internal class PlayerHandlerTest: BaseTest() {

    @Test
    fun shouldFindTwoCreatedPlayers() {
        val p1 = Player(name = "P1", userId = "123")
        val p2 = Player(name = "P2", userId = "456")

        val p1Str = mapper.writeValueAsString(p1)
        val p2Str = mapper.writeValueAsString(p2)

        val createdPlayer1 = createPlayer(p1Str)
        val createdPlayer2 = createPlayer(p2Str)

        val search: MutableList<Player>? = findPlayers(createdPlayer1?.id!!, createdPlayer2?.id!!)
        assertEquals(2, search?.size)
        assertEquals(p1.userId, search?.find { it.name == p1.name }?.userId)
        assertEquals(p2.name, search?.find { it.userId == p2.userId }?.name)
    }

    @Test
    fun shouldFindInventory() {
        val i1 = InventoryItem(name = "item1", description = "desc1")
        val i2 = InventoryItem(name = "item2", description = "desc2")
        val inventory = Inventory(listOf(i1, i2))

        val player = Player(name = "P1", userId = "123", inventory = inventory)
        val playerStr = mapper.writeValueAsString(player)
        val createdPlayer = createPlayer(playerStr)

        val search = findPlayer(createdPlayer?.id!!)
        assertEquals(2, search?.inventory?.items?.size)
        assertEquals(i1.description, search?.inventory?.items?.find { it.name == i1.name }?.description)
        assertEquals(i2.name, search?.inventory?.items?.find { it.description == i2.description }?.name)
    }

    private fun createPlayer(json: String): Player? =
        webClient.post().uri("/api/players")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(json), String::class.java))
            .exchange()
            .returnResult(Player::class.java)
            .responseBody
            .blockFirst()

    private fun findPlayers(id1: String, id2: String): MutableList<Player>? =
        webClient.get().uri("/api/players?ids=$id1,$id2")
            .exchange()
            .returnResult(Player::class.java)
            .responseBody
            .collectList()
            .block()

    private fun findPlayer(id: String): Player? =
        webClient.get().uri("/api/players/$id")
            .exchange()
            .returnResult(Player::class.java)
            .responseBody
            .blockFirst()
}
