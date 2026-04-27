import { bigIntSha256 } from '../util/hash'
import { createPrngModel } from '../_domain/types.prng.util'

class Sha256CounterPrng {
    private seed: string
    private counter: bigint

    constructor(seed: string) {
        this.seed = seed
        this.counter = 0n
    }

    public next() {
        const sample = bigIntSha256(`${this.seed}:${this.counter}`)
        this.counter++

        return sample & 0xffffffffffffffffn
    }
}

export const createPrng = (opts: { seed: string }) => {
    const prng = new Sha256CounterPrng(opts.seed)
    const u64Range = 1n << 64n

    return createPrngModel({
        random: (min, max) => {
            if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
                throw new Error(
                    'Invalid range: min and max must be safe integers.'
                )
            }
            if (max <= min) {
                throw new Error('Invalid range: max must be greater than min.')
            }

            const range = BigInt(max - min)
            const threshold = u64Range - (u64Range % range)

            let sample = prng.next()
            while (sample >= threshold) {
                sample = prng.next()
            }

            return Number(sample % range) + min
        },
    })
}
