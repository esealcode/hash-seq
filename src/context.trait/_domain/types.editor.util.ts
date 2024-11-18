import { TTrait } from '../_domain/types.editor.model'
import { createSetModel } from '../_domain/types.set.util'
import { createSetMemberModel } from '../_domain/types.set.util'
import { parseSet } from '../_domain/types.set.util'

export const getTraitSet = (trait: TTrait) => {
    if (trait.options.type === 'list') {
        return parseSet({ set: trait.options.list })
    }

    if (trait.options.type === 'range') {
        const range = trait.options
        return createSetModel({
            members: [...Array(Math.max(0, range.max - range.min + 1))].map(
                (_, n) =>
                    createSetMemberModel({
                        value: `${range.min + n}`,
                        multiplicity: 1,
                    })
            ),
            cardinality: range.max - range.min + 1,
            isMultiset: false,
        })
    }

    throw ''
}
