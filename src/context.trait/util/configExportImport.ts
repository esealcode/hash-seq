import { nanoid } from 'nanoid'
import { z } from 'zod'

import type { TConfigurationFormData } from '../_domain/types.editor.model'

/** Wire format for configuration export/import */
export const traitsConfigJsonSchema = z.object({
    manifold: z.string(),
    sets: z.record(z.string(), z.array(z.string())),
    resolution: z.string(),
})

export type TTraitsConfigJson = z.infer<typeof traitsConfigJsonSchema>

export function formDataToTraitsJson(
    data: Pick<
        TConfigurationFormData,
        'binding' | 'setCards' | 'entityDescription'
    >
): TTraitsConfigJson {
    const sets: Record<string, string[]> = {}
    for (const card of Object.values(data.setCards ?? {})) {
        const name = card.name.trim()
        if (!name) {
            continue
        }
        sets[name] = card.options.list.split(/\r?\n/)
    }
    return {
        manifold: data.binding ?? '',
        sets,
        resolution: data.entityDescription ?? '',
    }
}

export function traitsJsonToFormPatch(
    json: unknown
): Pick<
    TConfigurationFormData,
    'binding' | 'setCards' | 'entityDescription'
> {
    const parsed = traitsConfigJsonSchema.safeParse(json)
    if (!parsed.success) {
        const first = parsed.error.issues[0]
        const path = first?.path.join('.') ?? 'root'
        throw new Error(`${path}: ${first?.message ?? 'invalid value'}`)
    }

    const { manifold, sets, resolution } = parsed.data
    const setCards: TConfigurationFormData['setCards'] = {}

    for (const [rawName, members] of Object.entries(sets)) {
        const name = rawName.trim()
        if (!name) {
            continue
        }
        setCards[nanoid()] = {
            name,
            options: {
                type: 'list',
                list: members.join('\n'),
            },
        }
    }

    return {
        binding: manifold,
        setCards,
        entityDescription: resolution,
    }
}
