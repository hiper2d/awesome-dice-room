package com.hiper2d.model

import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "player")
data class Player(val id: String? = null, val userId: String, val name: String, val inventory: Inventory? = null)
