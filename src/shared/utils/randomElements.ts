function shuffleArray<T>(arr: T[]): T[] {
    const arrayCopy = [...arr]; // Create a copy of the original array
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]; // Swap elements
    }
    return arrayCopy;
}

function getRandomElements<T>(arr: T[], numElements: number): T[] {
    const shuffledArray = shuffleArray(arr);
    return shuffledArray.slice(0, numElements);
}

export default getRandomElements;
