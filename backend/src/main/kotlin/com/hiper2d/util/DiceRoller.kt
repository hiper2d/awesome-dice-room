package com.hiper2d.util

import kotlin.random.Random

internal const val DICE_PATTERN = "(\\d+)?d(\\d+)([+-]\\d+)?"

class DiceRoller {
    companion object {
        private val pattern = Regex(DICE_PATTERN)

        fun isRoll(message: String): Boolean {
            return pattern.containsMatchIn(message)
        }
    }

    fun roll(message: String): String {
        return message
            .split(" ")
            .fold("") { acc, str -> "$acc \n ${rollSingle(str)}" }
    }

    private fun rollSingle(message: String): String {
        val match = DiceRoller.pattern.matchEntire(message)
        return match?.let {
            val times: Int = intMatchOrElse(it.groupValues[1], 1)
            val sides: Int = match.groupValues[2].toInt()
            val modificator: Int = intMatchOrElse(match.groupValues[3], 0)

            (1..times)
                .map { "${roll(sides) + modificator}" }
                .fold("") { acc, res -> "$acc $res" }
        } ?: "System Error"
    }
}

internal fun roll(sides: Int): Int {
    return if (sides <= 1) 1 else Random.nextInt(1, sides)
}

internal fun intMatchOrElse(match: String, dedault: Int): Int {
    return match.let { if (it.isEmpty()) dedault else it.toInt() }
}