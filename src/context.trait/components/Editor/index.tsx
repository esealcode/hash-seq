'use client'

import React, { memo, useMemo } from 'react'
import { useForm, useWatch, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { multiply, reduce } from 'ramda'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { AddTraitButton } from './AddTraitButton'
import { BindingCard } from './BindingCard'
import { TraitCard } from './TraitCard'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import { configurationFormDataSchema } from '@/context.trait/_domain/types.editor.model'
import { getTraitProbability } from '@/context.trait/util/trait'
import { generator } from '@/context.trait/util/generator'

const Traits = memo((props) => {
    const form = useConfigurationForm()
    const { isValid, isValidating, isLoading, validatingFields, errors } =
        useFormState({ control: form.control })

    const traits = useWatch({ control: form.control, name: 'traits' })
    const binding = useWatch({ control: form.control, name: 'binding' })

    const p = useMemo(() => {
        console.debug(`@recompute p`, {
            traits,
            isValid,
            isValidating,
            isLoading,
            validatingFields,
            errors: { ...errors },
            errNum: Object.values({ ...errors }).length,
        })

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
    }, [traits, isValid, isValidating, isLoading, validatingFields, errors])

    const generation = useMemo(() => {
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

    console.debug(`@traits`, { p, generation })

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
        mode: 'onChange',
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
