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
        val savedRoom = createRoom()

        var updatedCount = addPlayerToRoom(savedRoom)
        assertEquals(1, updatedCount)

        var updatedRoom = getRoom(savedRoom)
        assertEquals(3, updatedRoom.playerIds.size)
        assertNotEquals(-1, updatedRoom.playerIds.indexOf("789"))

        updatedCount = deletePlayerFromRoom(savedRoom)
        assertEquals(1, updatedCount)

        updatedRoom = getRoom(savedRoom)
        assertEquals(2, updatedRoom.playerIds.size)
        assertEquals(-1, updatedRoom.playerIds.indexOf("789"))
    }

    private fun deletePlayerFromRoom(savedRoom: Room): Long {
        return webClient.delete().uri("/api/rooms/${savedRoom.id}/playerId/789")
            .exchange()
            .returnResult(Long::class.java)
            .responseBody
            .blockFirst()!!
    }

    private fun getRoom(savedRoom: Room): Room {
        return webClient.get().uri("/api/rooms/${savedRoom.id}")
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!
    }

    private fun addPlayerToRoom(savedRoom: Room): Long {
        return webClient.put().uri("/api/rooms/${savedRoom.id}/playerId/789")
            .exchange()
            .returnResult(Long::class.java)
            .responseBody
            .blockFirst()!!
    }

    private fun createRoom(): Room {
        val room = Room(name = "Test Room", playerIds = listOf("123", "456"))
        val roomJson = mapper.writeValueAsString(room)
        return webClient.post().uri("/api/rooms")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(roomJson), String::class.java))
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!
    }
}
