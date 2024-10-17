'use client'

import React, { memo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { AddTraitButton } from './AddTraitButton'
import { BindingCard } from './BindingCard'
import { TraitCard } from './TraitCard'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { configurationFormDataSchema } from '@/context.trait/_domain/types.editor.model'

const Traits = memo((props) => {
    const form = useConfigurationForm()
    const traits = useWatch({ control: form.control, name: 'traits' })

    return (
        <>
            {Object.entries(traits).map(([id, trait]) => {
                return <TraitCard key={id} traitId={id} />
            })}
        </>
    )
})
Traits.displayName = 'Traits'

export const ConfigurationEditor = memo((props) => {
    const form = useForm({
        resolver: zodResolver(configurationFormDataSchema),
        mode: 'all',
        defaultValues: {
            binding: '',
            traits: [],
        },
    })

    console.debug(`@form`, { errors: { ...form.formState.errors } })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((formData) => {})}
                className="space-y-8"
            >
                <div className="flex items-center mb-8">
                    <AddTraitButton />
                </div>

                <div className="flex flex-wrap gap-4">
                    <BindingCard />
                    <Traits />
                </div>
            </form>
        </Form>
    )
})

ConfigurationEditor.displayName = 'ConfigurationEditor'
