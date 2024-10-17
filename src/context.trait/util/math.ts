export const fact = (n: number) => {
    let ret = 1

    for (let i = 2; i <= n; i++) {
        ret *= i
    }

    return ret
}
