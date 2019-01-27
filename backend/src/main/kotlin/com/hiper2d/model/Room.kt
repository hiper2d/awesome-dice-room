package com.hiper2d.model

import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "room")
data class Room(val id: String? = null, val name: String)
