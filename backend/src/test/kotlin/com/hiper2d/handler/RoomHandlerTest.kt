package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Room
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

internal class RoomHandlerTest: BaseTest() {

    lateinit var room: Room
    lateinit var roomStr: String

    @BeforeEach
    fun setup() {
        room = Room(name = "Test Room")
        roomStr = mapper.writeValueAsString(room)
    }

    @Test
    fun shouldUpdateCreatedRoom() {
        val originalRoom = createRoom(roomStr)
        val newRoom = Room(id = originalRoom.id, name = "Updated")
        val newRoomJson = mapper.writeValueAsString(newRoom)
        val updatedRoom = updateRoom(newRoomJson)

        assertEquals(room.name, originalRoom?.name)
        assertEquals("Updated", updatedRoom?.name)
    }

    @Test
    fun shouldFindCreatedRoom() {
        val room = createRoom(roomStr)
        assertEquals(room.name, room?.name)
    }

    private fun createRoom(json: String): Room {
        return rest(
            webClient.post().uri("/api/rooms")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .body(BodyInserters.fromPublisher(Mono.just(json), String::class.java))
        )
    }

    private fun updateRoom(json: String): Room {
        return rest(
            webClient.put().uri("/api/rooms")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .body(BodyInserters.fromPublisher(Mono.just(json), String::class.java))
        )
    }

    private fun rest(spec: WebTestClient.RequestHeadersSpec<*>): Room {
        return spec
            .exchange()
            .returnResult(Room::class.java)
            .responseBody
            .blockFirst()!!
    }
}
