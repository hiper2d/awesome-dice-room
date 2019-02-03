package com.hiper2d.repository

import reactor.core.publisher.Mono

interface RoomRepositoryCustom {
    fun addPlayerIdToRoom(roomId: String, playerId: String): Mono<Long>
    fun removePlayerIdFromRoom(roomId: String, playerId: String): Mono<Long>
}
