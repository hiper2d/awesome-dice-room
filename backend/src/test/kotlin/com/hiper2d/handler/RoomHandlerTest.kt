package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Room
import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

@DisplayName("Given room exists")
internal class RoomHandlerTest: BaseTest() {

    private lateinit var room: Room

    @BeforeEach
    fun setup() {
        room = generateRoom("Test Room", mapper, webClient)
    }

    @Test
    fun `then should be able to update it`() {
        val newRoom = Room(id = room.id, name = "Updated", description = "")
        val newRoomJson = mapper.writeValueAsString(newRoom)
        val updatedRoom = updateRoom(newRoomJson)

        assertEquals("Updated", updatedRoom.name)
    }

    @Test
    fun `then should create new player and update room playerIds`() {
        val player1 = generateOrFindPlayer("Alex 1", "123", room.id!!, mapper, webClient)
        val player2 = generateOrFindPlayer("Alex 2", "456", room.id!!, mapper, webClient)
        val updatedRoom = findRoom(room.id!!, webClient)

        assertThat(updatedRoom.players, Matchers.containsInAnyOrder(player1, player2))
    }

    private fun updateRoom(json: String): Room =
        webClient.put().uri("/api/rooms")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(json), String::class.java))
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!
}
