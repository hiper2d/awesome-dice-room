package com.hiper2d.util

import java.util.*
import kotlin.random.Random

class DiceRoller {
    companion object {
        private val pattern = Regex("(\\d+)?d(\\d+)([+-]\\d+)?")

        fun isRoll(message: String): Boolean {
            return pattern.containsMatchIn(message)
        }

        private fun roll(sides: Int): Int {
            if (sides <=1) return 1

            return Random.nextInt(1, sides)
        }

        private fun tryIntMatchOrElse(match: String, els: Int): Int {
            return Optional.ofNullable(match)
                .map {v -> if (v.isEmpty()) els else v.toInt()}
                .orElse(els)
        }
    }

    fun roll(message: String): String {
        return message.split(" ")
            .fold(""){acc, str -> "$acc \n ${rollSingle(str)}"}
    }

    private fun rollSingle(message: String): String {
        return Optional.ofNullable(DiceRoller.pattern.matchEntire(message))
            .map{match ->
                val times: Int = tryIntMatchOrElse(match.groupValues[1], 1);
                val sides: Int = match.groupValues[2].toInt()
                val modificator: Int = tryIntMatchOrElse(match.groupValues[3], 0)
                var result = ""

                for (i in 1..times) {
                    result = "$result ${roll(sides) + modificator}"
                }

                result
            }.orElse("System Error")
    }
}
