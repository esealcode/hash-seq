'use client'

import { reduce } from 'ramda'
import { memo, useMemo } from 'react'
import { useFormState, useWatch } from 'react-hook-form'
import { ShieldCheck, ShieldAlert } from 'lucide-react'

import { Typo } from '@/components/ui/typography'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { getTraitProbability } from '@/context.trait/util/trait'

export const Probability = memo((props) => {
    const form = useConfigurationForm()
    const { isValid, isValidating, isLoading, validatingFields, errors } =
        useFormState({ control: form.control })

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
        } catch (err) {
            // @note: There is a fucking dumb lifecycle issue where isValid can be true and isValidating false while the data we get is in invalid state before
            // is gets updated again to isValid false.
            // @todo: Find why we have this dumbass behavior above where isValid can be true while traits is wrong data
            console.error(err)
            return 0n
        }
    }, [traits, errors])

    const strength = Number(p) / 2 ** 128
    const safeEnough = strength >= 1

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <Typo.strong>Strength</Typo.strong>
                <Typo.muted>
                    A value higher or equal to 1 means the signature is safe
                    enough, but the higher it is the stronger it will be.
                </Typo.muted>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex shrink-0">
                    {safeEnough ? (
                        <ShieldCheck className="h-4 w-4 stroke-[#37ac64]" />
                    ) : (
                        <ShieldAlert className="h-4 w-4 stroke-[#eb5976]" />
                    )}
                </div>
                <Typo.inlineCode className="truncate">
                    {strength.toFixed(32)}
                </Typo.inlineCode>
            </div>
        </div>
    )
})
Probability.displayName = 'Probability'
