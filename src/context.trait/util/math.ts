export const fact = (n: bigint) => {
    let ret = 1n

    for (let i = 2n; i <= n; i++) {
        ret *= i
    }

    return ret
}
