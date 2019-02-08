package com.hiper2d.model.dto

import com.hiper2d.model.Player
import com.hiper2d.model.Room

data class RoomFull constructor(val id: String?, val name: String, val players: List<Player>) {

    constructor(room: Room, players: List<Player>) : this(room.id, room.name, players)
}
