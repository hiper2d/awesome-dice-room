package com.hiper2d.util

data class WsMessage(
    val type: String,
    val data: Any?
)

data class WsRoomMessage(
    val type: String,
    val roomId: String,
    val data: Any?,
    val sender: String,
    val direct: Boolean = false,
    val to: String = ""
)
