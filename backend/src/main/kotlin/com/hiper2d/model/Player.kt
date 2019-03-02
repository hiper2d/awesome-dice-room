package com.hiper2d.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "player")
@CompoundIndexes(value = [
    CompoundIndex(name = "name_and_room_id_index", def = "{'name' : 1, 'roomId': 1}")
])
data class Player(
    @Id val id: String?,
    val roomId: String,
    val name: String,
    val avatar: String,
    val color: String,
    val inventory: Inventory?
)
