import { ENEMY_COLORS } from "../maps/constants"

export const getRandomInteger = (n: number) => {
    return Math.round(Math.random() * n)
}

export const getRandomEnemyColor = () => {
    return ENEMY_COLORS[getRandomInteger(ENEMY_COLORS.length - 1)]
}