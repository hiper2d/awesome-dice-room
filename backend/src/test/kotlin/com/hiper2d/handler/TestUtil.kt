package com.hiper2d.handler

import com.fasterxml.jackson.databind.ObjectMapper
import com.hiper2d.model.Player
import com.hiper2d.model.Room
import com.hiper2d.model.dto.RoomFull
import org.springframework.http.MediaType
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.reactive.function.BodyInserters
import reactor.core.publisher.Mono

fun generateRoom(name: String, mapper: ObjectMapper, webClient: WebTestClient): Room {
    val room = Room(name = name)
    val roomJson = mapper.writeValueAsString(room)

    return webClient.post().uri("/api/rooms")
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(BodyInserters.fromPublisher(Mono.just(roomJson), String::class.java))
        .exchange()
        .returnResult(Room::class.java)
        .responseBody
        .blockFirst()!!
}

fun findRoom(id: String, webClient: WebTestClient): RoomFull {
    return webClient.get().uri("/api/rooms/$id")
        .exchange()
        .returnResult(RoomFull::class.java)
        .responseBody
        .blockFirst()!!
}

fun generateOrFindPlayer(name: String, userId: String, roomId: String, mapper: ObjectMapper, webClient: WebTestClient): Player {
    val player = Player(name = name, userId = userId, roomId = roomId)
    val playerJson = mapper.writeValueAsString(player)

    return webClient.post().uri("/api/players/find-or-create")
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(BodyInserters.fromPublisher(Mono.just(playerJson), String::class.java))
        .exchange()
        .returnResult(Player::class.java)
        .responseBody
        .blockFirst()!!
}

