// Set - No repetition - No order - r <= n => C(n, r)
// Set - No repetition - No order - r > n => Pigeon hole, impossible => 0
//
// Set - No repetition - Ordered - r <= n => P(n, r)
// Set - No repetition - Ordered - r > n => Pigeon hole, impossible => 0
//
// Set - Repetition - No order => C(n+r-1, r)
//
// Set - Repetition - Ordered => n^r

import { TSet } from '../_domain/types.set.model'
import { TPrng } from '../../context.prng/_domain/types.prng.model'

import { fact } from './math'

const assertSimpleSet = (set: TSet) => {
    if (set.isMultiset) {
        throw new Error('Invalid set: members must be unique.')
    }
}

export const countCombination = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    r: bigint
}) => {
    const { set, repetition = false, r } = opts
    const n = BigInt(set.cardinality)

    assertSimpleSet(set)

    if (repetition) {
        if (r === 0n) {
            return 1n
        }
        if (n === 0n) {
            return 0n
        }
        return fact(n + r - 1n) / (fact(r) * fact(n - 1n))
    }

    if (r > n) {
        return 0n
    }

    return fact(n) / (fact(r) * fact(n - r))
}

export const countPermutation = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    r: bigint
}) => {
    const { set, repetition = false, r } = opts
    const n = BigInt(set.cardinality)

    assertSimpleSet(set)

    if (repetition) {
        return n ** r
    }

    if (r > n) {
        return 0n
    }

    return fact(n) / fact(n - r)
}

export const select = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    prng: TPrng
    r: number
}) => {
    const { set, repetition = false, r, prng } = opts

    assertSimpleSet(set)

    const randomIndex = (size: number) => prng.random(0, size)

    if (repetition) {
        return [...Array(r)].map(
            () => set.members[randomIndex(set.cardinality)].value
        )
    }

    const members = [...set.members]
    const out: T['members'][number]['value'][] = []
    for (let i = 0; i < r; i++) {
        const index = randomIndex(members.length)
        out.push(...members.splice(index, 1).map((member) => member.value))
    }

    return out
}
