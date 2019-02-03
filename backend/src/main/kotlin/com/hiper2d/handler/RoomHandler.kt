package com.hiper2d.handler

import com.hiper2d.model.Room
import com.hiper2d.repository.RoomRepository
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono

@Component
class RoomHandler(private val roomRepository: RoomRepository) {

    fun findRoom(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(roomRepository.findById(req.pathVariable("id")), Room::class.java)

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
}
