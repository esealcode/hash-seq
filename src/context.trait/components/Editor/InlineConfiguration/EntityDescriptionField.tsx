'use client'

import React, { Fragment, memo, useMemo, useState } from 'react'
import { useFormState, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Typo } from '@/components/ui/typography'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { generator } from '@/context.trait/util/generator'
import { EntityStrength } from './EntityStrength'

function buildPreviewNodes(
    source: string,
    generation: { sel: string[] }[] | null
): React.ReactNode {
    const matches = Array.from(
        source.matchAll(
            /\{(?:(-?\d+)\.\.(-?\d+)|([\w-]+))\}\[(\d+)\]([!>]{0,2})/g
        )
    )
    if (matches.length === 0) {
        return (
            <span className="whitespace-pre-wrap break-words">{source}</span>
        )
    }
    if (!generation || generation.length !== matches.length) {
        return (
            <span className="whitespace-pre-wrap break-words text-muted-foreground">
                {source}
            </span>
        )
    }

    const nodes: React.ReactNode[] = []
    let last = 0
    matches.forEach((m, i) => {
        const idx = m.index!
        const span = m[0].length
        if (idx > last) {
            nodes.push(
                <Fragment key={`t-${i}`}>
                    {source.slice(last, idx)}
                </Fragment>
            )
        }
        const values = generation[i]!.sel
        const label = `[${values.join(', ')}]`
        nodes.push(
            <strong key={`v-${i}`} className="font-semibold text-foreground">
                {label}
            </strong>
        )
        last = idx + span
    })
    if (last < source.length) {
        nodes.push(
            <Fragment key="tail">{source.slice(last)}</Fragment>
        )
    }
    return <>{nodes}</>
}

export const EntityDescriptionField = memo((props) => {
    const form = useConfigurationForm()
    const { errors } = useFormState({ control: form.control })
    const [isEditing, setIsEditing] = useState(false)

    const traits = useWatch({ control: form.control, name: 'traits' })
    const binding = useWatch({ control: form.control, name: 'binding' })
    const setCards = useWatch({ control: form.control, name: 'setCards' })
    const entityDescription = useWatch({
        control: form.control,
        name: 'entityDescription',
    })

    const availableSets = useMemo(() => {
        if (!setCards) {
            return []
        }
        return Object.entries(setCards).map(([setId, card]) => ({
            setId,
            name: card.name.trim(),
        }))
    }, [setCards])

    const generation = useMemo(() => {
        if (Object.values(errors).length > 0) {
            return null
        }
        try {
            return generator({
                configuration: {
                    binding: binding ?? '',
                    setCards: {},
                    entityDescription: entityDescription ?? '',
                    traits: traits ?? {},
                },
            })
        } catch {
            return null
        }
    }, [binding, entityDescription, traits, errors])

    return (
        <FormField
            control={form.control}
            name="entityDescription"
            render={({ field }) => (
                <FormItem>
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        <Typo.h4>Sets resolution</Typo.h4>
                        <EntityStrength />
                    </div>
                    <FormDescription>
                        Describe the entity and its attributes using the following syntax:  
                        <Typo.inlineCode>{'{setName}[count]'}</Typo.inlineCode>{' '}
                        for a named set, or{' '}
                        <Typo.inlineCode>{'{min..max}[count]'}</Typo.inlineCode>{' '}
                        for a numeric range (inclusive). Optional suffix after{' '}
                        <Typo.inlineCode>]</Typo.inlineCode>:{' '}
                        <Typo.inlineCode>!</Typo.inlineCode> (no repeat),{' '}
                        <Typo.inlineCode>&gt;</Typo.inlineCode> (strict order). Once the strength score reaches 1, the configuration is considered safe enough.
                    </FormDescription>
                    {availableSets.length > 0 ? (
                        <div className="flex items-center flex-wrap gap-2">
                            <Typo.small>Available sets:</Typo.small>
                            <div className="flex flex-wrap gap-2">
                                {availableSets.map(({ setId, name }) => (
                                    <span
                                        key={setId}
                                        className="inline-flex max-w-full items-center truncate rounded-md border border-border px-2 py-0.5 text-xs font-semibold text-foreground"
                                    >
                                        {name || 'Unnamed'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Typo.muted className="text-sm">
                            No sets defined yet. Add at least one set first.
                        </Typo.muted>
                    )}
                    <FormControl>
                        {isEditing ? (
                            <Textarea
                                className="min-h-[10rem] font-mono text-sm"
                                placeholder={`Pick {fruit}[3]!> and roll {1..6}[1]>.`}
                                {...field}
                            />
                        ) : (
                            <div
                                role="presentation"
                                className="min-h-[10rem] w-full p-2 border font-mono text-sm text-foreground whitespace-pre-wrap break-words"
                                onDoubleClick={() => setIsEditing(true)}
                            >
                                {entityDescription?.length ? (
                                    buildPreviewNodes(
                                        entityDescription,
                                        generation
                                    )
                                ) : (
                                    <span className="text-muted-foreground">
                                        Double-click or choose Edit below to
                                        write the entity description.
                                    </span>
                                )}
                            </div>
                        )}
                    </FormControl>
                    <div className="flex justify-end pt-3">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => setIsEditing((v) => !v)}
                        >
                            {isEditing ? 'Ok' : 'Edit'}
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
})
EntityDescriptionField.displayName = 'EntityDescriptionField'
