'use client'

import React, { memo } from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useForm,
} from '@/components/ui/form'
import { createSlot, TSlotScope } from '@/components/ui/slot'
import { Textarea } from '@/components/ui/textarea'

const slots = {
    Trigger: createSlot(SheetTrigger),
    Title: createSlot(SheetTitle),
    Description: createSlot(SheetDescription),
    SubmitButton: createSlot(Button),
}

const formSchema = z.object({
    rules: z.string(),
})

type TFormData = z.infer<typeof formSchema>

const FormContent = memo<{
    onSubmit: (data: TFormData) => void
    data: TFormData
    $scope: TSlotScope
}>((props) => {
    const { onSubmit, data, $scope } = props

    const form = useForm({
        schema: formSchema,
        mode: 'all',
        defaultValues: {
            ...data,
        },
    })

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid gap-4 pt-4">
                        <FormField
                            control={form.control}
                            name={`rules`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Rules</FormLabel>
                                        </div>
                                        <Textarea
                                            className="w-full min-h-[10rem]"
                                            placeholder="e.g: Only ---- is able to claim this signature."
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <SheetFooter>
                            <slots.SubmitButton.Slot
                                $scope={$scope}
                                type="submit"
                                disabled={!form.formState.isValid}
                            >
                                Save
                            </slots.SubmitButton.Slot>
                        </SheetFooter>
                    </div>
                </form>
            </Form>
        </>
    )
})
FormContent.displayName = 'CreateTraitModalFormContent'

const Root = memo<
    React.PropsWithChildren<
        {
            data: TFormData
            onSubmit: (data: TFormData) => void
        } & React.ComponentProps<typeof Sheet>
    >
>((props) => {
    const { children, data, onSubmit, ...sheetProps } = props

    return (
        <Sheet {...sheetProps}>
            <slots.Trigger.Slot $scope={children} asChild />
            <SheetContent side="left">
                <SheetHeader>
                    <slots.Title.Slot $scope={children}>
                        Binding
                    </slots.Title.Slot>
                    <slots.Description.Slot $scope={children}>
                        What rules does this signature will apply to the entity?
                    </slots.Description.Slot>
                    <FormContent
                        onSubmit={onSubmit}
                        data={data}
                        $scope={children}
                    />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
})

Root.displayName = 'UpdateBindingSheet'

export const UpdateBindingSheet = Object.assign(Root, {
    slots,
})
