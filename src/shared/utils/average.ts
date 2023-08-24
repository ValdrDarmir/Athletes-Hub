import sum from "./sum";

function average(...numbers: number[]) {
    return sum(...numbers) / numbers.length;
}

export default average;
