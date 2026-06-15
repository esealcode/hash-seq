import { z } from 'zod'

import { setListHasDuplicateMembers } from './types.set.util'
import { getTraitSet } from './types.editor.util'

export const traitOptionVariantSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('list'),
        list: z.string(),
    }),
    z.object({
        type: z.literal('range'),
        min: z.number(),
        max: z.number(),
    }),
])

export type TTraitOptionVariant = z.infer<typeof traitOptionVariantSchema>
export type TTraitOptionVariantType = TTraitOptionVariant['type']

export const traitSchema = z
    .object({
        name: z.string(),
        description: z.string(),
        count: z.number(),
        noRepeat: z.boolean(),
        strictOrder: z.boolean(),
        options: traitOptionVariantSchema,
    })
    .superRefine((trait, ctx) => {
        if (trait.options.type === 'range') {
            const opt = trait.options

            if (opt.min > opt.max) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['options', 'min'],
                    message: 'Must be greater than or equal to max',
                })
            }
        }

        const set = getTraitSet(trait)

        const isMultiset = set.isMultiset
        const repetition = !trait.noRepeat
        const order = trait.strictOrder

        if (!repetition && trait.count > set.cardinality) {
            // Pigeon hole
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['count'],
                message:
                    'Cannot select more that available without allowing repetitions.',
            })
        }

        if (isMultiset) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options', 'list'],
                message: 'Invalid set: options list must contain unique members.',
            })
        }
    })

export type TTrait = z.infer<typeof traitSchema>

/** Named list sets only; numeric ranges use `{min..max}[count]` in entity text */
export const setCardSchema = z
    .object({
        /** Referenced as `{thisName}[count]` */
        name: z.string().min(1),
        options: z.object({
            type: z.literal('list'),
            list: z.string(),
        }),
    })
    .superRefine((card, ctx) => {
        if (setListHasDuplicateMembers(card.options.list)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options', 'list'],
                message:
                    'Duplicate members: each line must be unique.',
            })
        }
    })

export type TSetCard = z.infer<typeof setCardSchema>

export const configurationSchema = z.object({
    /** Rule text; PRNG seed combines this with raw `entityDescription` (see generator) */
    binding: z.string(),
    setCards: z.record(z.string(), setCardSchema),
    /** Free text: `{setName}[count]!>` for named sets, `{min..max}[count]!>` for numeric ranges; `#` line comments ignore refs. Included in the binding seed as written (no set resolution) */
    entityDescription: z.string(),
    traits: z.record(z.string(), traitSchema),
})
export type TConfiguration = z.infer<typeof configurationSchema>

export const configurationFormDataSchema = configurationSchema
export type TConfigurationFormData = z.infer<typeof configurationFormDataSchema>
