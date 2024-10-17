'use client'

import { memo } from 'react'

import { FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const BindingEditor = memo((props) => {
    const form = useConfigurationForm()

    return (
        <FormField
            control={form.control}
            name="binding"
            render={({ field }) => {
                return (
                    <Textarea
                        className="w-full min-h-[calc(200rem/16)] max-h-[calc(400rem/16)]"
                        placeholder="Binding..."
                        {...field}
                    />
                )
            }}
        />
    )
})

BindingEditor.displayName = 'BindingEditor'
