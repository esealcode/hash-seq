'use client'

import { reduce } from 'ramda'
import { memo, useMemo } from 'react'
import { useFormState, useWatch } from 'react-hook-form'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

import { Typo } from '@/components/ui/typography'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { getTraitProbability } from '@/context.trait/util/trait'

export const EntityStrength = memo((props) => {
    const form = useConfigurationForm()
    const { errors } = useFormState({ control: form.control })
    const traits = useWatch({ control: form.control, name: 'traits' })

    const p = useMemo(() => {
        if (Object.values(errors).length > 0) {
            return 0n
        }
        try {
            return reduce(
                (acc, value) => acc * value,
                1n,
                Object.values(traits).map((trait) => getTraitProbability(trait))
            )
        } catch {
            return 0n
        }
    }, [traits, errors])

    const strength = Number(p) / 2 ** 128
    const safeEnough = strength >= 1

    return (
        <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
            title="A value ≥ 1 means the configuration is safe enough; higher is stronger."
        >
            <span className="text-muted-foreground shrink-0">Strength</span>
            <div className="flex items-center gap-1.5 min-w-0">
                {safeEnough ? (
                    <ShieldCheck className="h-4 w-4 shrink-0 stroke-[#37ac64]" />
                ) : (
                    <ShieldAlert className="h-4 w-4 shrink-0 stroke-[#eb5976]" />
                )}
                <Typo.inlineCode className="truncate max-w-[min(100%,28rem)]">
                    {strength.toFixed(32)}
                </Typo.inlineCode>
            </div>
        </div>
    )
})
EntityStrength.displayName = 'EntityStrength'
