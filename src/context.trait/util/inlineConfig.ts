import { TTrait } from '../_domain/types.editor.model'

export function traitsFromEntityDescription(
    sets: Record<string, string>,
    description: string
): { traits: Record<string, TTrait>; errors: string[] } {
    const traits: Record<string, TTrait> = {}
    const errors: string[] = []
    let i = 0

    for (const m of description.matchAll(
        /\{(?:(-?\d+)\.\.(-?\d+)|([\w-]+))\}\[(\d+)\]([!>]{0,2})/g
    )) {
        const count = Number(m[4])
        const suf = m[5] ?? ''
        if (suf.length) {
            if (!/^[!>]{1,2}$/.test(suf) || (suf.length === 2 && suf[0] === suf[1])) {
                errors.push(`Invalid suffix in "${m[0]}"`)
                continue
            }
        }
        if (!Number.isFinite(count) || count < 0) {
            errors.push(`Invalid count in "${m[0]}"`)
            continue
        }

        const noRepeat = suf.includes('!')
        const strictOrder = suf.includes('>')

        if (m[3] !== undefined) {
            const list = sets[m[3]]
            if (list === undefined) {
                errors.push(`Unknown set "${m[3]}"`)
                continue
            }
            traits[`t${i++}`] = {
                name: m[3].replace(/_/g, ' '),
                description: '',
                count,
                noRepeat,
                strictOrder,
                options: { type: 'list', list },
            }
        } else {
            const min = Number(m[1])
            const max = Number(m[2])
            if (min > max) {
                errors.push(`Invalid range in "${m[0]}"`)
                continue
            }
            traits[`t${i++}`] = {
                name: `${min}..${max}`,
                description: '',
                count,
                noRepeat,
                strictOrder,
                options: { type: 'range', min, max },
            }
        }
    }

    return { traits, errors }
}
