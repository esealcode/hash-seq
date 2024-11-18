import { createPrng } from '@/context.prng/models/xorshiro256++'
import { TConfiguration } from '../_domain/types.editor.model'
import { getTraitSet } from '../_domain/types.editor.util'
import { select } from './combinatorics'

export const generator = (opts: { configuration: TConfiguration }) => {
    const prng = createPrng({
        seed: `${opts.configuration.binding}`,
    })

    const selection = Object.values(opts.configuration.traits).map((trait) => {
        const set = getTraitSet(trait)

        const sel = select({
            prng,
            set,
            repetition: !trait.noRepeat,
            r: trait.count,
        })

        return { trait, sel }
    })

    return selection
}
