'use client'
import { memo, useState, useMemo, useEffect } from 'react'
import {
    useForm,
    useFormContext,
    useWatch,
    useFormState,
    FormProvider,
    Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
    count: z.number().max(10),
})

const Input = memo((props) => {
    const { control, getValues, trigger } = useFormContext()

    const { isValid, isValidating, isLoading, validatingFields, errors } =
        useFormState({ control })

    const p = useMemo(() => {
        const { count } = getValues()
        console.debug(`@recompute p`, {
            count,
            isValid,
            isValidating,
            isLoading,
            validatingFields: { ...validatingFields },
            errors: { ...errors },
            errNum: Object.values({ ...errors }).length,
        })

        if (!isValid || isValidating) {
            return 0
        }

        try {
            return BigInt(count)
        } catch (err) {
            console.error('Caught error', err)
            return 0
        }
    }, [isValid, isValidating, isLoading, validatingFields, errors])

    return (
        <Controller
            control={control}
            name="count"
            render={({ field }) => {
                return (
                    <input
                        className="w-full"
                        placeholder="Max."
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => {
                            field.onChange(e.target.valueAsNumber)
                            trigger()
                        }}
                    />
                )
            }}
        />
    )
})
Input.displayName = 'Input'

export const Component = memo((props) => {
    const form = useForm({
        resolver: zodResolver(schema),
        mode: 'all',
        defaultValues: {
            count: 0,
        },
    })

    return (
        <div className="flex flex-col p-8">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit((formData) => {})}>
                    <Input />
                </form>
            </FormProvider>
        </div>
    )
})
Component.displayName = 'Component'
