import randomElements from "../../shared/utils/randomElements";

export enum StepGoals {
    A, B, C, D, E, F, G, H
}

export interface StepGoalInfo {
    stepGoal: StepGoals
    name: string
    description: string
}

export function getRandomStepGoals(amount: number) {
    // don't forget to update this, when adding new step goals
    const allStepGoals: StepGoals[] = [
        StepGoals.A,
        StepGoals.B,
        StepGoals.C,
    ]

    return randomElements(allStepGoals, amount)
}

export function getStepGoalInfos(stepGoal: StepGoals): StepGoalInfo {
    return {
        [StepGoals.A]: {stepGoal: StepGoals.A, name: "A", description: "A Description",},
        [StepGoals.B]: {stepGoal: StepGoals.B, name: "B", description: "B Description",},
        [StepGoals.C]: {stepGoal: StepGoals.C, name: "C", description: "C Description",},
        [StepGoals.D]: {stepGoal: StepGoals.D, name: "D", description: "D Description",},
        [StepGoals.E]: {stepGoal: StepGoals.E, name: "E", description: "E Description",},
        [StepGoals.F]: {stepGoal: StepGoals.F, name: "F", description: "F Description",},
        [StepGoals.G]: {stepGoal: StepGoals.G, name: "G", description: "G Description",},
        [StepGoals.H]: {stepGoal: StepGoals.H, name: "H", description: "H Description",},
    }[stepGoal]
}
