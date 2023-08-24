
function asc (...arr: number[]) {
    return arr.sort((a, b) => a - b);
}

function quantile(q: number, ...arr: number[]) {
    const sorted = asc(...arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
}

export default quantile;
