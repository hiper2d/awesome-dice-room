package com.hiper2d.model.dto

import com.hiper2d.model.Player

data class RoomFull constructor(val id: String? = null, val name: String, val players: List<Player>)
