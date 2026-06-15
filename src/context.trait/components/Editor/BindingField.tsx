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
                        <Typo.h4>Manifold</Typo.h4>
                        <FormDescription>
                            The manifold is a piece of text that will seed the kernel, you can declare anything related to the entity here such as ownership, usage conditions etc.
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
