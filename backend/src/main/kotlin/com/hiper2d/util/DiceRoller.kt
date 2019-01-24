package com.hiper2d.util

import kotlin.random.Random

internal const val DICE_PATTERN = "(\\d+)?d(\\d+)([+-]\\d+)?"

internal data class DieProp(val times: Int, val sides: Int, val modificator: Int)

class DiceRoller {
    companion object {
        private val pattern = Regex(DICE_PATTERN)
        fun isRoll(message: String): Boolean = pattern.containsMatchIn(message)
    }

    fun roll(message: String): String {
        return message
            .split(" ")
            .fold("") { acc, str -> "$acc \n ${rollSingle(str)}" }
    }

    private fun rollSingle(message: String): String {
        val match = DiceRoller.pattern.matchEntire(message)
        return match?.let {
            val dieProp = getDieProp(it)
            return dieProp.run {
                (1..times)
                    .map { "${roll(sides) + modificator}" }
                    .fold("") { acc, res -> "$acc $res" }
            }
        } ?: "System Error"
    }
}

internal fun roll(sides: Int): Int = sides.takeIf { it > 1 }?.let { Random.nextInt(1, it) } ?: 1
internal fun intMatchOrElse(match: String, default: Int): Int = match.takeIf{ !it.isEmpty() }?.toInt() ?: default

internal fun getDieProp(match: MatchResult): DieProp {
    val times: Int = intMatchOrElse(match.groupValues[1], 1)
    val sides: Int = match.groupValues[2].toInt()
    val modificator: Int = intMatchOrElse(match.groupValues[3], 0)
    return DieProp(times, sides, modificator)
}
