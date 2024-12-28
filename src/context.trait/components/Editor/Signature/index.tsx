'use client'

import { memo, useMemo } from 'react'
import { useFormState, useWatch } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Probability } from './Probability'
import { Typo } from '@/components/ui/typography'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { generator } from '@/context.trait/util/generator'

export const Signature = memo((props) => {
    const form = useConfigurationForm()
    const { errors } = useFormState({ control: form.control })

    const traits = useWatch({ control: form.control, name: 'traits' })
    const binding = useWatch({ control: form.control, name: 'binding' })

    const generation = useMemo(() => {
        console.debug(`@gen`, { errors })
        if (Object.values(errors).length > 0) {
            return []
        }

        try {
            return generator({
                configuration: {
                    binding,
                    traits,
                },
            })
        } catch (err) {
            // @note: There is a fucking dumb lifecycle issue where isValid can be true and isValidating false while the data we get is in invalid state before
            // is gets updated again to isValid false.
            // @todo: Find why we have this dumbass behavior above where isValid can be true while traits is wrong data
            console.error(err)
            return []
        }
    }, [binding, traits, errors])

    return (
        <div className="flex flex-col gap-8 overflow-auto mt-6">
            <Probability />
            {generation.map((gen, key) => {
                return (
                    <div key={key} className="flex flex-col gap-4">
                        <div>
                            <Typo.strong>{gen.trait.name}</Typo.strong>
                            <Typo.muted>{gen.trait.description}</Typo.muted>
                        </div>
                        <div className="flex flex-col max-h-[40rem] overflow-y-auto pr-2 gap-2">
                            {gen.sel.map((sel, key) => {
                                const id = `${gen.trait.name}${key}`
                                return (
                                    <Label key={key}>
                                        <Typo.inlineCode className="flex items-center gap-2">
                                            <Checkbox id={id} />
                                            <span>{sel}</span>
                                        </Typo.inlineCode>
                                    </Label>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            {generation.length === 0 ? (
                <div className="flex items-center justify-center h-[10rem]">
                    <Typo.muted>No generation</Typo.muted>
                </div>
            ) : null}
        </div>
    )
})
Signature.displayName = 'Signature'
