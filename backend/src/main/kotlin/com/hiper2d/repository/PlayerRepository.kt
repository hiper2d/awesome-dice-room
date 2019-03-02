package com.hiper2d.repository

import com.hiper2d.model.Player
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface PlayerRepository: ReactiveMongoRepository<Player, String> {
    fun findAllByIdIn(list: List<String>): Flux<Player>
    fun findByRoomIdAndName(roomId: String, name: String): Mono<Player>
}
