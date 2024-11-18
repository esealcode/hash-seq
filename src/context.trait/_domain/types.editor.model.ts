import { z } from 'zod'

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
                message: 'Too many selection (r > n)',
            })
        }

        if (isMultiset && !repetition && !order) {
            // Unsupported
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options', 'list'],
                message:
                    'Unsupported parameters combination (multiset + no repeat + no order)',
            })
        }

        if (
            isMultiset &&
            !repetition &&
            order &&
            trait.count < set.cardinality
        ) {
            // Unsupported
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options', 'list'],
                message:
                    'Unsupported parameters combination (multiset + no repeat + order + count < set cardinality)',
            })
        }

        if (isMultiset && repetition) {
            // Unsupported
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['options', 'list'],
                message:
                    'Unsupported parameters combination (multiset + repeat)',
            })
        }
    })

export type TTrait = z.infer<typeof traitSchema>

export const configurationSchema = z.object({
    binding: z.string(),
    traits: z.record(z.string(), traitSchema),
})
export type TConfiguration = z.infer<typeof configurationSchema>

export const configurationFormDataSchema = configurationSchema
export type TConfigurationFormData = z.infer<typeof configurationFormDataSchema>
