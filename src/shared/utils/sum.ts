function sum(...numbers: number[]) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}

export default sum;
