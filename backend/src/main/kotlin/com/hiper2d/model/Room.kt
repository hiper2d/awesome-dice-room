package com.hiper2d.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "room")
data class Room(
    @Id val id: String?,
    val name: String,
    val description: String,
    val playerIds: List<String> = emptyList()
)
