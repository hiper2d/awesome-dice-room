package com.hiper2d.repository

import com.hiper2d.model.Player
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface PlayerRepository: ReactiveMongoRepository<Player, String> {

    fun findAllByIdIn(list: List<String>): Flux<Player>

    fun findByRoomIdAndUserId(roomId: String, userId: String): Mono<Player>
}
