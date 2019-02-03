package com.hiper2d.handler

import com.hiper2d.model.Player
import com.hiper2d.repository.PlayerRepository
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.ServerRequest
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.bodyToMono
import reactor.core.publisher.Mono

@Component
class PlayerHandler(val playerRepository: PlayerRepository) {

    fun findPlayer(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(playerRepository.findById(req.pathVariable("id")), Player::class.java)

    fun findPlayers(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(getPlayers(req), Player::class.java)

    fun createPlayer(req: ServerRequest): Mono<ServerResponse> = ServerResponse.ok()
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .body(req.bodyToMono<Player>().flatMap { playerRepository.insert(it) }, Player::class.java)

    private fun getPlayers(req: ServerRequest) =
        req.queryParam("ids")
            .map { it.split(",") }
            .map { ids -> playerRepository.findAllByIdIn(ids) }
            .orElse(null)
}
