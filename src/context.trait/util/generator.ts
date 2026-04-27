import { createPrng } from '@/context.prng/models/sha256-counter'
import { TConfiguration } from '../_domain/types.editor.model'
import { getTraitSet } from '../_domain/types.editor.util'
import { select } from './combinatorics'

function bindingSeed(configuration: TConfiguration): string {
    // Raw entity text (unresolved {set}[n] syntax), same as stored in the form
    return `${configuration.binding}\n${configuration.entityDescription}`
}

export const generator = (opts: { configuration: TConfiguration }) => {
    const prng = createPrng({
        seed: bindingSeed(opts.configuration),
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
