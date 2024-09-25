import hash from 'hash.js'

const bigIntHash = (input: string) => {
    return BigInt(`0x${hash.sha256().update(input).digest('hex')}`)
}

export const createPrng = (opts: { seed: string }) => {
    const next = { current: bigIntHash(opts.seed) }

    const rand = () => {
        const out = next.current

        next.current = bigIntHash(next.current.toString(16))

        return out
    }

    const random = (min: number, max: number) => {
        return (rand() % BigInt(max - min)) + BigInt(min)
    }

    return {
        random,
    }
}
