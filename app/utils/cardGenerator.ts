export type CardGeneratorType = "fibonacci" | "powers-of-two" | "sequential" | "t-shirts";

export function generateCardPreset(type: CardGeneratorType): string[] {
    switch (type) {
        case "fibonacci":
            return generateFibonacci(100).map(card => card.toString())
        case "powers-of-two":
            return generatePowersOfTwo(80).map(card => card.toString())
        case "sequential":
            return generateSequential(20).map(card => card.toString())
        case "t-shirts":
            return ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        default:
            return [];
    }
}

function generateFibonacci(limit: number) {
    const fib = [0, 1];
    let number = fib[fib.length - 1] + fib[fib.length - 2];

    while (number < limit) {
        fib.push(number);
        number = fib[fib.length - 1] + fib[fib.length - 2];
    }

    return fib;
}

function generatePowersOfTwo(limit: number) {
    const powers = [];
    let number = 1;

    while (number <= limit) {
        powers.push(number);
        number *= 2;
    }
    return powers;
}


function generateSequential(limit: number) {
    const seq = [];

    for (let i = 1; i <= limit; i++) {
        seq.push(i);
    }

    return seq;
}

