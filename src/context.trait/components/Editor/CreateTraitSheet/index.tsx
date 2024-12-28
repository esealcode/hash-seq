'use client'

import React, { memo } from 'react'
import { z } from 'zod'

import { createSlot, TSlotScope } from '@/components/ui/slot'
import {
    useForm,
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from '@/components/ui/form'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectValue,
    SelectContent,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const slots = {
    Trigger: createSlot(SheetTrigger),
    Title: createSlot(SheetTitle),
    Description: createSlot(SheetDescription),
    SubmitButton: createSlot(Button),
}

const formSchema = z.object({
    name: z.string().min(1, 'Must not be empty'),
    description: z.string(),
    type: z.union([z.literal('list'), z.literal('range')]),
})

type TFormData = z.infer<typeof formSchema>

const FormContent = memo<{
    onSubmit: (data: TFormData) => void
    $scope: TSlotScope
}>((props) => {
    const { onSubmit, $scope } = props

    const form = useForm({
        schema: formSchema,
        mode: 'all',
        defaultValues: {
            name: '',
            description: '',
            type: 'list',
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
                            name={`name`}
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Name</FormLabel>
                                        </div>
                                        <Input
                                            className="w-full"
                                            placeholder="e.g: Painting cans ordering"
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
                                            placeholder="e.g: The cans must be placed according to this trait order selection."
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={form.control}
                            name={`type`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Option type</FormLabel>
                                    <Select
                                        onValueChange={(type) => {
                                            field.onChange(type)
                                        }}
                                        defaultValue="list"
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an option type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="list">
                                                List
                                            </SelectItem>
                                            <SelectItem value="range">
                                                Range
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <slots.SubmitButton.Slot
                                $scope={$scope}
                                type="submit"
                                disabled={!form.formState.isValid}
                            >
                                Create
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
            onSubmit: (data: TFormData) => void
        } & React.ComponentProps<typeof Sheet>
    >
>((props) => {
    const { children, onSubmit, ...sheetProps } = props

    return (
        <Sheet {...sheetProps}>
            <slots.Trigger.Slot $scope={children} asChild />
            <SheetContent side="left" className="sm:max-w-[425px]">
                <SheetHeader>
                    <slots.Title.Slot $scope={children}>
                        Creat trait
                    </slots.Title.Slot>
                    <slots.Description.Slot $scope={children}>
                        Tell a bit more about what the trait should be in the
                        entity.
                    </slots.Description.Slot>
                    <FormContent onSubmit={onSubmit} $scope={children} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
})

Root.displayName = 'CreateTraitSheet'

export const CreateTraitSheet = Object.assign(Root, {
    slots,
})
