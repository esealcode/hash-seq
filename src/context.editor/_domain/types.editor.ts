import { z } from 'zod'

export const proofSchema = z.object({
    contract: z.string(),
    plaintext: z.string(),
    skipMap: z.string(),
})

export type TProof = z.infer<typeof proofSchema>

export const proofFormDataSchema = proofSchema

export type TProofFormData = z.infer<typeof proofFormDataSchema>
