import { bigIntSha256 } from '../util/hash'
import { segmentBigInt } from '../util/bits'
import { normalizeBigInt64 } from '../util/normalize'
import { randomIntFromNormalized } from '../util/random'
import { createPrngModel } from '../_domain/types.prng.util'

class Xoshiro256PlusPlus {
    private state: [bigint, bigint, bigint, bigint]

    constructor(seed: string) {
        const bigIntSeed = bigIntSha256(seed)
        this.state = segmentBigInt({
            value: bigIntSeed,
            segmentSize: 64,
            segmentCount: 4,
        })
    }

    private rotl64(x: bigint, k: bigint) {
        return ((x << k) | (x >> (64n - k))) & 0xffffffffffffffffn
    }

    public next() {
        const state = this.state
        const result = this.rotl64(state[0] + state[3], 23n) + state[0]

        const t = state[1] << 17n

        state[2] ^= state[0]
        state[3] ^= state[1]
        state[1] ^= state[2]
        state[0] ^= state[3]
        state[2] ^= t

        state[3] = this.rotl64(state[3], 45n)

        return result & 0xffffffffffffffffn
    }
}

export const createPrng = (opts: { seed: string }) => {
    const prng = new Xoshiro256PlusPlus(opts.seed)

    return createPrngModel({
        random: (min, max) => {
            const n = normalizeBigInt64(prng.next())
            return randomIntFromNormalized(n, min, max)
        },
    })
}
