// Set - No repetition - No order - k < n => C(n, k)
// Set - No repetition - No order - k = n => C(n, k)
// Set - No repetition - No order - k > n => Pigeon hole, impossible
// Multiset - No repetition - No order - k < n => Would require constrained stars and bars.
// Multiset - No repetition - No order - k = n => 1
// Multiset - No repetition - No order - k > n => 0

// Set - No repetition - Ordered - k < n => P(n, k)
// Set - No repetition - Ordered - k = n => P(n, k)
// Set - No repetition - Ordered - k > n => Pigeon hole, impossible
// Multiset - No repetition - Ordered - k < n => Would require to find all valid selections of x1 + x2 + ... + xm = n and aggregating multiset permutation for each of them
// Multiset - No repetition - Ordered - k = n => (n1+n2...+nk)!/(n1!n2!...nk!)
// Multiset - No repetition - Ordered - k > n => Pigeon hole

// Set - Repetition - No order - k < n => (n+k-1, k)
// Set - Repetition - No order - k = n => (n+k-1, k)
// Set - Repetition - No order - k > n => (n+k-1, k)
// Multiset - Repetition - No order - k <=> n => Is equivalent to biased randomness and require probability aggregation

// Set - Repetition - Ordered - k < n => k^n
// Set - Repetition - Ordered - k = n => k^n
// Set - Repetition - Ordered - k > n => k^n
// Multiset - Repetition - Ordered - k <=> n => Is equivalent to biased randomness and require probability aggregation

import { sum, reduce, multiply } from 'ramda'
import { TSet } from '../_domain/types.set.model'
import { TPrng } from '../../context.prng/_domain/types.prng.model'

import { fact } from './math'

export const countCombination = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    r: bigint
}) => {
    const { set, repetition = false, r } = opts

    if (repetition) {
        const ret =
            fact(BigInt(set.cardinality) + r - 1n) /
            (fact(r) * fact(BigInt(set.cardinality) - 1n))
        console.debug(`@combine with repeat`, {
            set,
            r,
            ret,
            fact: fact(BigInt(set.cardinality) - 1n),
        })
        return ret
    }

    return (
        fact(BigInt(set.cardinality)) /
        (fact(r) * fact(BigInt(set.cardinality) - r))
    )
}

export const countPermutation = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    r: bigint
}) => {
    const { set, repetition = false, r } = opts

    if (set.isMultiset) {
        return (
            fact(
                BigInt(sum(set.members.map((member) => member.multiplicity)))
            ) /
            reduce(
                (acc, value) => acc * value,
                1n,
                set.members.map((member) => fact(BigInt(member.multiplicity)))
            )
        )
    }

    if (repetition) {
        return BigInt(set.cardinality) ** r
    }

    return fact(BigInt(set.cardinality)) / fact(BigInt(set.cardinality) - r)
}

export const select = <T extends TSet>(opts: {
    set: T
    repetition?: boolean
    prng: TPrng
    r: number
}) => {
    const { set, repetition = false, r, prng } = opts

    if (repetition) {
        return [...Array(r)].map(
            () => set.members[prng.random(0, set.cardinality)].value
        )
    }

    const members = [...set.members]
    const out: T['members'][number]['value'][] = []
    for (let i = 0; i < r; i++) {
        const index = prng.random(0, set.cardinality)
        out.push(...members.splice(index, 1).map((member) => member.value))
    }

    return out
}
