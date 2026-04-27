'use client'

import React, { memo, useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'

import { Typo } from '@/components/ui/typography'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { traitsFromEntityDescription } from '@/context.trait/util/inlineConfig'
import { AddSetButton } from './AddSetButton'
import { EntityDescriptionField } from './EntityDescriptionField'
import { SetCard } from './SetCard'

export const InlineConfigurationFields = memo((props) => {
    const form = useConfigurationForm()
    const { setValue, control } = form
    const [parseError, setParseError] = useState<string | null>(null)

    const setCards = useWatch({
        control,
        name: 'setCards',
    })
    const entityDescription = useWatch({
        control,
        name: 'entityDescription',
    })

    useEffect(() => {
        const sets: Record<string, string> = {}
        for (const card of Object.values(setCards ?? {})) {
            const name = card.name.trim()
            if (!name) {
                setParseError('Every set must have a non-empty name')
                return
            }
            if (name in sets) {
                setParseError(`Duplicate set name "${name}"`)
                return
            }
            sets[name] = card.options.list
        }

        const { traits, errors } = traitsFromEntityDescription(
            sets,
            entityDescription ?? ''
        )
        if (errors.length > 0) {
            setParseError(errors.join('\n'))
            return
        }

        setParseError(null)
        setValue('traits', traits, {
            shouldValidate: true,
            shouldDirty: false,
        })
    }, [setCards, entityDescription, setValue])

    return (
        <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Sets
                    </h2>
                    <AddSetButton />
                </div>
                <Typo.muted className="max-w-2xl">
                    Each card is a named list (one member per line). Numeric
                    ranges are written only in the entity text as{' '}
                    <Typo.inlineCode>{`{min..max}[count]`}</Typo.inlineCode>, not
                    as sets.
                </Typo.muted>

                <div className="flex flex-wrap gap-4">
                    {Object.keys(setCards ?? {}).map((setId) => (
                        <SetCard key={setId} setId={setId} />
                    ))}
                    {Object.keys(setCards ?? {}).length === 0 ? (
                        <div className="flex flex-col gap-2 items-center justify-center min-h-[10rem] w-full rounded-lg border border-dashed">
                            <Typo.muted>No sets yet.</Typo.muted>
                            <Typo.muted>
                                Click <Typo.strong>Add set</Typo.strong> to
                                create one.
                            </Typo.muted>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-3xl">
                <EntityDescriptionField />

                {parseError ? (
                    <div
                        role="alert"
                        className="rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive whitespace-pre-wrap"
                    >
                        {parseError}
                    </div>
                ) : null}
            </div>
        </div>
    )
})

InlineConfigurationFields.displayName = 'InlineConfigurationFields'
