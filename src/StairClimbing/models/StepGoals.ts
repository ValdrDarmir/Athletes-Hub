import randomElements from "../../shared/utils/randomElements";
import Disciplines from "../../User/models/Disciplines";
import {stepGoalsAirRifle} from "./StepGoalsAirRifle";
import {stepGoalsPistol} from "./StepGoalsPistol";

export interface StepGoal {
    shots: number
    scoreRange: string
    description: string
}

export const stepGoalsByDiscipline: Record<Disciplines, StepGoal[]> = {
    [Disciplines.AirRifle]: stepGoalsAirRifle,
    [Disciplines.Pistol]: stepGoalsPistol,
}

export function getRandomStepGoals(discipline: Disciplines, amount: number) {
    const stepGoals = stepGoalsByDiscipline[discipline]

    return randomElements(stepGoals, amount)
}
