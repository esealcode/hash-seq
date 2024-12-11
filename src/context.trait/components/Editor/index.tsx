'use client'

import React, { memo, useMemo } from 'react'
import { useForm, useWatch, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { multiply, reduce } from 'ramda'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Typo } from '@/components/ui/typography'
import { AddTraitButton } from './AddTraitButton'
import { UpdateBindingButton } from './UpdateBindingButton'
import { SignatureButton } from './SignatureButton'
import { Signature } from './Signature'
import { TraitCard } from './TraitCard'
import { HashListener } from './HashListener'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { configurationFormDataSchema } from '@/context.trait/_domain/types.editor.model'
import { getTraitProbability } from '@/context.trait/util/trait'

const Traits = memo((props) => {
    const form = useConfigurationForm()
    const { isValid, isValidating, isLoading, validatingFields, errors } =
        useFormState({ control: form.control })

    const traits = useWatch({ control: form.control, name: 'traits' })

    return (
        <>
            {Object.entries(traits).map(([id, trait]) => {
                return <TraitCard key={id} traitId={id} />
            })}
            {Object.entries(traits).length === 0 ? (
                <div className="flex flex-col gap-2 items-center justify-center h-[10rem] w-full">
                    <div>
                        <Typo.muted>Nothing to see here yet.</Typo.muted>
                    </div>
                    <div>
                        <Typo.muted>
                            You can start by clicking the{' '}
                            <Typo.strong>Add trait</Typo.strong> button above.
                        </Typo.muted>
                    </div>
                </div>
            ) : null}
        </>
    )
})
Traits.displayName = 'Traits'

export const ConfigurationEditor = memo((props) => {
    const form = useForm({
        resolver: zodResolver(configurationFormDataSchema),
        mode: 'onChange',
        defaultValues: {
            binding: '',
            traits: {},
        },
    })

    console.debug(`@form`, { errors: { ...form.formState.errors } })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((formData) => {})}
                className="flex items-start h-full"
            >
                <HashListener />
                <div className="flex flex-col flex-1 p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <AddTraitButton />
                        <UpdateBindingButton />
                        <SignatureButton />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Traits />
                    </div>
                </div>

                {/*<div className="flex flex-col h-full border-l border-1 w-[30rem] p-6">
                    <Signature />
                </div>*/}
            </form>
        </Form>
    )
})

ConfigurationEditor.displayName = 'ConfigurationEditor'
