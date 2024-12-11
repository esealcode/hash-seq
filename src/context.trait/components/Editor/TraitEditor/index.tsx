'use client'

import React, { memo } from 'react'
import { useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'

import {
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormField,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const TraitEditor = memo<{
    traitId: string
}>((props) => {
    const { traitId } = props
    const form = useConfigurationForm()
    const trait = useWatch({ control: form.control, name: `traits.${traitId}` })

    // @warn: dirty hack because of https://github.com/react-hook-form/resolvers/issues/538#issuecomment-1504222680
    useDebounce(
        () => {
            console.debug(`@trigger manual`)
            form.trigger()
        },
        40,
        [trait]
    )

    return (
        <div className="flex flex-col flex-1 gap-4">
            <FormField
                control={form.control}
                name={`traits.${traitId}.count`}
                render={({ field }) => {
                    return (
                        <FormItem className="flex flex-col">
                            <div className="space-y-1 leading-none">
                                <FormLabel>Generation count</FormLabel>
                            </div>
                            <FormControl>
                                <Input
                                    className="w-full"
                                    placeholder="Count"
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e.target.valueAsNumber)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }}
            />

            {trait.options.type === 'list' ? (
                <FormField
                    control={form.control}
                    name={`traits.${traitId}.options.list`}
                    render={({ field }) => {
                        return (
                            <FormItem className="flex flex-col">
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Options list</FormLabel>
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
                        )
                    }}
                />
            ) : null}

            {trait.options.type === 'range' ? (
                <>
                    <div className="flex items-start gap-2">
                        <FormField
                            control={form.control}
                            name={`traits.${traitId}.options.min`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Min</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                className="w-full"
                                                placeholder="Min."
                                                min={0}
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        isNaN(
                                                            e.target
                                                                .valueAsNumber
                                                        )
                                                            ? ''
                                                            : e.target
                                                                  .valueAsNumber
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name={`traits.${traitId}.options.max`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Max</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                className="w-full"
                                                placeholder="Max."
                                                type="number"
                                                min={0}
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        isNaN(
                                                            e.target
                                                                .valueAsNumber
                                                        )
                                                            ? ''
                                                            : e.target
                                                                  .valueAsNumber
                                                    )
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    </div>
                </>
            ) : null}

            <div className="flex items-center gap-4 flex-wrap">
                <FormField
                    control={form.control}
                    name={`traits.${traitId}.noRepeat`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>No repeat</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={`traits.${traitId}.strictOrder`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Strict order</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
})

TraitEditor.displayName = 'TraitEditor'
