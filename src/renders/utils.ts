import { ENEMY_COLORS } from "../maps/constants"
import { Direction } from "./types/directionType"

export const getRandomInteger = (n: number) => {
    return Math.round(Math.random() * n)
}

export const getRandomEnemyColor = () => {
    return ENEMY_COLORS[getRandomInteger(ENEMY_COLORS.length - 1)]
}

export const getReverseDirection = (direction: Direction): Direction => {
    switch (direction) {
        case "Down":
            return "Up"
        case "Up":
            return "Down"
        case "Left":
            return "Right"
        case "Right":
            return "Left"
    }
}