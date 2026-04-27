'use client'

import React, { memo } from 'react'
import { useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'

import {
    FormItem,
    FormLabel,
    FormControl,
    FormField,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const SetEditor = memo<{
    setId: string
}>((props) => {
    const { setId } = props
    const form = useConfigurationForm()
    const card = useWatch({
        control: form.control,
        name: `setCards.${setId}`,
    })

    useDebounce(
        () => {
            form.trigger()
        },
        40,
        [card]
    )

    return (
        <div className="flex flex-col flex-1 gap-4">
            <FormField
                control={form.control}
                name={`setCards.${setId}.options.list`}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <div className="space-y-1 leading-none">
                            <FormLabel>Members</FormLabel>
                        </div>
                        <FormControl>
                            <Textarea
                                className="w-full flex-1 min-h-[calc(200rem/16)] resize-none"
                                placeholder={`Apple\nPear\nKiwi`}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
})

SetEditor.displayName = 'SetEditor'
