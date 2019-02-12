package com.hiper2d.handler

import com.hiper2d.model.Player
import com.hiper2d.repository.PlayerRepository
import com.hiper2d.repository.RoomRepository
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono

@Component
class PlayerHandler(private val roomRepository: RoomRepository, private val playerRepository: PlayerRepository) {

    fun findPlayer(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(playerRepository.findById(req.pathVariable("id")), Player::class.java)

    fun findOrCreate(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(createPlayerAndUpdateRoom(req), Player::class.java)

    private fun createPlayerAndUpdateRoom(req: ServerRequest) =
        findOrCreatePlayer(req).flatMap { player ->
            player.id?.let {
                this.roomRepository.addPlayerIdToRoom(roomId = player.roomId, playerId = player.id).map { player }
            } ?: Mono.error { RuntimeException("Player cannot be added to room, God knows why") }
        }

    private fun findOrCreatePlayer(req: ServerRequest) =
        req.bodyToMono<Player>().flatMap {
            playerRepository
                .findByRoomIdAndUserId(it.roomId, it.userId)
                .switchIfEmpty(playerRepository.insert(it))
        }
}
