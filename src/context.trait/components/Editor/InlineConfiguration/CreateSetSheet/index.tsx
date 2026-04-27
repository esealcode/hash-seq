'use client'

import React, { memo } from 'react'
import { z } from 'zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useForm,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
} from '@/components/ui/sheet'
import { TSlotScope } from '@/components/ui/slot'
import { slots } from './slots'

const formSchema = z.object({
    name: z.string().min(1, 'Must not be empty'),
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Set name</FormLabel>
                                    </div>
                                    <Input
                                        className="w-full"
                                        placeholder="e.g. fruit, dice_rolls"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <slots.SubmitButton.Slot
                                $scope={$scope}
                                type="submit"
                                disabled={!form.formState.isValid}
                            >
                                Add set
                            </slots.SubmitButton.Slot>
                        </SheetFooter>
                    </div>
                </form>
            </Form>
        </>
    )
})
FormContent.displayName = 'CreateSetSheetFormContent'

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
                        Add set
                    </slots.Title.Slot>
                    <slots.Description.Slot $scope={children}>
                        Named list (one member per line). For numeric ranges,
                        use <code className="text-xs">{`{min..max}[count]`}</code>{' '}
                        in the entity description instead.
                    </slots.Description.Slot>
                    <FormContent onSubmit={onSubmit} $scope={children} />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
})

Root.displayName = 'CreateSetSheet'

export const CreateSetSheet = Object.assign(Root, {
    slots,
})
