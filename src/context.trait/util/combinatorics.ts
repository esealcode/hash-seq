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
import { TPrng } from '../_domain/types.prng.model'

import { fact } from './math'

export const countCombination = <T extends TSet<any>>(opts: {
    set: T
    repetition?: boolean
    r: number
}) => {
    const { set, repetition = false, r } = opts

    if (repetition) {
        return (
            fact(set.cardinality + r - 1) /
            (fact(r) * fact(set.cardinality - 1))
        )
    }

    return fact(set.cardinality) / (fact(r) * fact(set.cardinality - r))
}

export const countPermutation = <T extends TSet<any>>(opts: {
    set: T
    repetition?: boolean
    r: number
}) => {
    const { set, repetition = false, r } = opts

    if (set.isMultiset) {
        return (
            fact(sum(set.members.map((member) => member.multiplicity))) /
            reduce(
                multiply,
                0,
                set.members.map((member) => fact(member.multiplicity))
            )
        )
    }

    if (repetition) {
        return set.cardinality ** r
    }

    return fact(set.cardinality) / fact(set.cardinality - r)
}

export const select = <T extends TSet<any>>(opts: {
    set: T
    repetition?: boolean
    prng: TPrng
    r: number
}) => {
    const { set, repetition = false, r, prng } = opts

    if (repetition) {
        return [...Array(r)].map(
            () => set.members[prng.randomInt(0, set.cardinality)].value
        )
    }

    const members = [...set.members]
    const out: T[] = []
    for (let i = 0; i < r; i++) {
        const index = prng.randomInt(0, set.cardinality)
        out.push(...members.splice(index, 1).map((member) => member.value))
    }

    return out
}
