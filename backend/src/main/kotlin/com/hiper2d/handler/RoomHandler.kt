package com.hiper2d.handler

import com.hiper2d.model.Room
import com.hiper2d.model.dto.RoomDto
import com.hiper2d.repository.PlayerRepository
import com.hiper2d.repository.RoomRepository
import com.mongodb.client.result.UpdateResult
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono
import reactor.core.publisher.toMono

@Component
class RoomHandler(private val roomRepository: RoomRepository, private val playerRepository: PlayerRepository) {

    fun findRoom(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(getRoomWithPlayers(req), RoomDto::class.java)

    fun allRooms(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(roomRepository.findAll(), Room::class.java)

    fun createRoom(req: ServerRequest): Mono<ServerResponse> = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(req.bodyToMono<Room>().flatMap { roomRepository.insert(it) }, Room::class.java)

    fun updateRoom(req: ServerRequest): Mono<ServerResponse> = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(req.bodyToMono<Room>().flatMap { roomRepository.save(it) }, Room::class.java)

    fun removeRoom(req: ServerRequest): Mono<ServerResponse> = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(roomRepository.deleteById(req.pathVariable("id")), Void::class.java)

    fun addPlayerIdToRoom(req: ServerRequest): Mono<ServerResponse> = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(pushPlayerIdToRoom(req), Long::class.java)

    fun removePlayerIdFromRoom(req: ServerRequest): Mono<ServerResponse> = ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(pullPlayerIdFromRoom(req), Long::class.java)

    private fun pushPlayerIdToRoom(req: ServerRequest) =
        roomRepository.addPlayerIdToRoom(req.pathVariable("id"), req.pathVariable("playerId"))

    private fun pullPlayerIdFromRoom(req: ServerRequest) =
        roomRepository.removePlayerIdFromRoom(req.pathVariable("id"), req.pathVariable("playerId"))

    private fun getRoomWithPlayers(req: ServerRequest) =
        roomRepository.findById(req.pathVariable("id"))
            .flatMap { room ->
                this.playerRepository.findAllByIdIn(room.playerIds)
                    .collectList()
                    .map { players -> RoomDto(room, players) }
            }
}
