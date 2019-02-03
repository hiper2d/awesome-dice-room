package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Room
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

internal class RoomWithPlayersHandlerTest: BaseTest() {

    @Test
    fun shouldUpdatePlayerIdsInRoom() {
        val room = Room(name = "Test Room", playerIds = listOf("123", "456"))
        val roomJson = mapper.writeValueAsString(room)

        val savedRoom = webClient.post().uri("/api/rooms")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(roomJson), String::class.java))
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!

        var updatedCount = webClient.put().uri("/api/rooms/${savedRoom.id}/playerIds/789")
            .exchange()
            .returnResult(Long::class.java)
            .responseBody
            .blockFirst()!!

        assertEquals(1, updatedCount)

        var updatedRoom = webClient.get().uri("/api/rooms/${savedRoom.id}")
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!

        assertEquals(3, updatedRoom.playerIds.size)
        assertNotEquals(-1, updatedRoom.playerIds.indexOf("789"))

        updatedCount = webClient.delete().uri("/api/rooms/${savedRoom.id}/playerIds/789")
            .exchange()
            .returnResult(Long::class.java)
            .responseBody
            .blockFirst()!!

        assertEquals(1, updatedCount)

        updatedRoom = webClient.get().uri("/api/rooms/${savedRoom.id}")
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!

        assertEquals(2, updatedRoom.playerIds.size)
        assertEquals(-1, updatedRoom.playerIds.indexOf("789"))
    }
}
