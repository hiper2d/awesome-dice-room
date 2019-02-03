package com.hiper2d.repository.impl

import com.hiper2d.model.Room
import com.hiper2d.repository.RoomRepositoryCustom
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.ReactiveMongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import reactor.core.publisher.Mono


class RoomRepositoryImpl(@Autowired val mongoTemplate: ReactiveMongoTemplate): RoomRepositoryCustom {

    override fun addPlayerIdToRoom(roomId: String, playerId: String): Mono<Long> =
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("id").`is`(roomId)),
            Update().push("playerIds", playerId),
            Room::class.java
        ).map { it.modifiedCount }

    override fun removePlayerIdFromRoom(roomId: String, playerId: String): Mono<Long> =
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("id").`is`(roomId)),
            Update().pull("playerIds", playerId),
            Room::class.java
        ).map { it.modifiedCount }
}
