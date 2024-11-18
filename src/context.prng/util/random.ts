export const randomIntFromNormalized = (
    n: number,
    min: number,
    max: number
) => {
    return Math.floor(n * (max - min) + min)
}
