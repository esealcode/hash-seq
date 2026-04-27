'use client'

import React, { memo } from 'react'

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

export const BindingField = memo(() => {
    const form = useConfigurationForm()

    return (
        <FormField
            control={form.control}
            name="binding"
            render={({ field }) => (
                <FormItem>
                    <div className="space-y-1">
                        <FormLabel>Binding</FormLabel>
                        <FormDescription>
                            Which rules this signature applies to the entity. The
                            raw entity description (including{' '}
                            <Typo.inlineCode>{'{setName}[count]'}</Typo.inlineCode>
                            -style references) is part of the same binding; set
                            values are resolved only after the binding is fixed.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Textarea
                            className="min-h-[10rem] w-full font-mono text-sm"
                            placeholder="e.g: Only ---- is able to claim this signature."
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
})

BindingField.displayName = 'BindingField'
