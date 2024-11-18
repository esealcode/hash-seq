import { TTrait } from '../_domain/types.editor.model'
import { countCombination, countPermutation } from './combinatorics'
import { getTraitSet } from '../_domain/types.editor.util'

export const getTraitProbability = (trait: TTrait) => {
    const isPermutation = trait.strictOrder

    if (isPermutation) {
        return countPermutation({
            set: getTraitSet(trait),
            r: BigInt(trait.count),
            repetition: !trait.noRepeat,
        })
    }

    return countCombination({
        set: getTraitSet(trait),
        r: BigInt(trait.count),
        repetition: !trait.noRepeat,
    })
}
