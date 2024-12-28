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
import { Input } from '@/components/ui/input'
import { createSlot, TSlotScope } from '@/components/ui/slot'
import { Textarea } from '@/components/ui/textarea'

const slots = {
    Trigger: createSlot(SheetTrigger),
    Title: createSlot(SheetTitle),
    Description: createSlot(SheetDescription),
    SubmitButton: createSlot(Button),
}

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
})

type TFormData = z.infer<typeof formSchema>

const FormContent = memo<{
    data: TFormData
    onSubmit: (data: TFormData) => void
    $scope: TSlotScope
}>((props) => {
    const { data, onSubmit, $scope } = props

    const form = useForm({
        schema: formSchema,
        mode: 'all',
        defaultValues: { ...data },
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
                            name={`name`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Name</FormLabel>
                                        </div>
                                        <Input
                                            className="w-full"
                                            placeholder="Name"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name={`description`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Description</FormLabel>
                                        </div>
                                        <Textarea
                                            className="w-full"
                                            placeholder="Description"
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
                                Update
                            </slots.SubmitButton.Slot>
                        </SheetFooter>
                    </div>
                </form>
            </Form>
        </>
    )
})
FormContent.displayName = 'UpdateTraitModalFormContent'

const Root = memo<
    React.PropsWithChildren<
        {
            data: TFormData
            onSubmit: (data: TFormData) => void
        } & React.ComponentProps<typeof Sheet>
    >
>((props) => {
    const { data, children, onSubmit, ...sheetProps } = props

    return (
        <Sheet {...sheetProps}>
            <slots.Trigger.Slot $scope={children} asChild />
            <SheetContent side="left" className="sm:max-w-[425px]">
                <SheetHeader>
                    <slots.Title.Slot $scope={children}>
                        Update trait
                    </slots.Title.Slot>
                    <slots.Description.Slot $scope={children}>
                        Tell a bit more about what the trait should be in the
                        entity.
                    </slots.Description.Slot>
                    <FormContent
                        data={data}
                        onSubmit={onSubmit}
                        $scope={children}
                    />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
})

Root.displayName = 'UpdateTraitSheet'

export const UpdateTraitSheet = Object.assign(Root, {
    slots,
})
