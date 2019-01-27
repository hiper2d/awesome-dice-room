package com.hiper2d.handler

import com.hiper2d.BaseTest
import com.hiper2d.model.Room
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

internal class RoomHandlerTest: BaseTest() {

    @Test
    fun addRoom() {
        val room = Room(name = "Test Room")
        val roomStr = mapper.writeValueAsString(room)
        val res = webClient.post().uri("/api/addRoom")
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .body(BodyInserters.fromPublisher(Mono.just(roomStr), String::class.java))
            .exchange()
            .expectStatus().isOk
            .expectHeader().contentType(MediaType.APPLICATION_JSON_UTF8)
            .expectBody(Room::class.java)
            .returnResult()

        val roomRes = res.responseBody
        assertEquals(room.name, roomRes?.name)
    }
}
