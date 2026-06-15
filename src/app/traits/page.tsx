'use client'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { BindingField } from '@/context.trait/components/Editor/BindingField'
import { ConfigurationImportExport } from '@/context.trait/components/Editor/ConfigurationImportExport'
import { Typo } from '@/components/ui/typography'
import { AddSetButton } from '@/context.trait/components/Editor/InlineConfiguration/AddSetButton'
import { EntityDescriptionField } from '@/context.trait/components/Editor/InlineConfiguration/EntityDescriptionField'
import { SetCard } from '@/context.trait/components/Editor/InlineConfiguration/SetCard'
import {
    configurationFormDataSchema,
    type TConfigurationFormData,
} from '@/context.trait/_domain/types.editor.model'
import { setListHasDuplicateMembers } from '@/context.trait/_domain/types.set.util'
import { traitsFromEntityDescription } from '@/context.trait/util/inlineConfig'

export default function Traits() {
    const form = useForm<TConfigurationFormData>({
        resolver: zodResolver(configurationFormDataSchema),
        mode: 'onChange',
        defaultValues: {
            binding: '',
            setCards: {},
            entityDescription: '',
            traits: {},
        },
    })
    const [stepIndex, setStepIndex] = useState(0)
    const [parseError, setParseError] = useState<string | null>(null)
    const setCards = useWatch({
        control: form.control,
        name: 'setCards',
    })
    const entityDescription = useWatch({
        control: form.control,
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
            if (setListHasDuplicateMembers(card.options.list)) {
                setParseError(
                    `Set "${name}" contains duplicate lines; each member must appear once.`
                )
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
        form.setValue('traits', traits, {
            shouldValidate: true,
            shouldDirty: false,
        })
    }, [setCards, entityDescription, form])

    console.debug(`@form`, { errors: { ...form.formState.errors } })

    return (
        <div className="flex min-h-0 flex-col items-center px-4 py-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((formData) => {})}
                    className="flex h-full min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-background"
                >
                    <div className="shrink-0 border-b border-border">
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
                            <div className="flex justify-start">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Previous step"
                                    disabled={stepIndex === 0}
                                    onClick={() =>
                                        setStepIndex((i) =>
                                            Math.max(0, i - 1)
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                {[0, 1, 2].map((dot) => (
                                    <button
                                        type="button"
                                        key={dot}
                                        onClick={() => setStepIndex(dot)}
                                        aria-label={`Go to step ${dot + 1}`}
                                        aria-current={
                                            dot === stepIndex
                                                ? 'step'
                                                : undefined
                                        }
                                        className={`h-2.5 w-2.5 rounded-full transition-colors hover:bg-black/70 ${
                                            dot <= stepIndex
                                                ? 'bg-black'
                                                : 'bg-black/30'
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Next step"
                                    disabled={stepIndex === 2}
                                    onClick={() =>
                                        setStepIndex((i) =>
                                            Math.min(2, i + 1)
                                        )
                                    }
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-1 justify-center overflow-auto p-8">
                        <div className="w-full">
                        {stepIndex === 0 ? (
                            <div className="space-y-4">
                                <BindingField />
                            </div>
                        ) : null}

                        {stepIndex === 1 ? (
                            <div className="flex flex-col gap-2 w-full">
                                <Typo.h4>Sets declaration</Typo.h4>
                                <Typo.muted>
                                    A set is a list of line separated attributes, you can reference them in the sets resolution field.
                                </Typo.muted>

                                <div className="flex flex-wrap items-stretch gap-4">
                                    {Object.keys(setCards ?? {}).map((setId) => (
                                        <SetCard key={setId} setId={setId} />
                                    ))}
                                    <AddSetButton />
                                </div>
                            </div>
                        ) : null}

                        {stepIndex === 2 ? (
                            <div className="flex flex-col gap-4 w-full">
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
                        ) : null}
                        </div>
                    </div>

                        <div className="flex justify-end border-t border-border px-4 py-2 sm:px-6">
                            <ConfigurationImportExport />
                        </div>
                </form>
            </Form>
        </div>
    )
}
