package com.hiper2d.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "player")
data class Player(
    @Id val id: String?,
    val userId: String,
    val roomId: String,
    val name: String,
    val avatar: String,
    val color: String,
    val inventory: Inventory?
)
