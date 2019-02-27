package com.hiper2d.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "player")
@CompoundIndexes(value = [
    CompoundIndex(name = "room_id_user_id", def = "{'userId' : 1, 'roomId': 1}")
])
data class Player(
    @Id val id: String?,
    val userId: String,
    val roomId: String,
    @Indexed(unique = true) val name: String,
    val avatar: String,
    val color: String,
    val inventory: Inventory?
)
