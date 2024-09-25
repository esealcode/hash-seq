import { z } from 'zod'

export const proofSchema = z
    .object({
        config: z.object({
            minWordsPerSentence: z.number(),
            maxWordsPerSentence: z.number(),
            dictionnary: z.string(),
            strict: z.boolean(),
        }),
        contract: z.string(),
        plaintext: z.string(),
    })
    .superRefine((data, ctx) => {
        if (
            data.config.minWordsPerSentence >= data.config.maxWordsPerSentence
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be lower than max words',
                path: ['config', 'minWordsPerSentence'],
            })
        }
    })

export type TProof = z.infer<typeof proofSchema>

export const proofFormDataSchema = proofSchema

export type TProofFormData = z.infer<typeof proofFormDataSchema>
