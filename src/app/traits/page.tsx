'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { BindingField } from '@/context.trait/components/Editor/BindingField'
import { ConfigurationEditor } from '@/context.trait/components/Editor'
import { configurationFormDataSchema } from '@/context.trait/_domain/types.editor.model'

export default function Traits() {
    const form = useForm({
        resolver: zodResolver(configurationFormDataSchema),
        mode: 'onChange',
        defaultValues: {
            binding: '',
            setCards: {},
            entityDescription: '',
            traits: {},
        },
    })

    console.debug(`@form`, { errors: { ...form.formState.errors } })

    return (
        <div className="flex flex-col h-full min-h-0">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((formData) => {})}
                    className="flex flex-col h-full min-h-0"
                >
                    <div className="shrink-0 space-y-4 border-b border-border px-4 py-4">
                        <BindingField />
                    </div>
                    <ConfigurationEditor />
                </form>
            </Form>
        </div>
    )
}
