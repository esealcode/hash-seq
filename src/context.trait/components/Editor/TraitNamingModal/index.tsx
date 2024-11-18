'use client'

import React, { memo } from 'react'

import { Slot, createSlots, useSlots } from '@/components/ui/slot'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const slots = createSlots({
    Trigger: DialogTrigger,
    Title: DialogTitle,
    Description: DialogDescription,
    SubmitButton: Button,
})

type TModalData = {
    name: string
    description: string
}

const Root = memo<
    React.PropsWithChildren<{
        onSubmit: (data: TModalData) => void
    }>
>((props) => {
    const { templates } = useSlots({ slots, ...props })

    return (
        <Dialog>
            <Slot template={templates.Trigger} asChild />
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <Slot template={templates.Title}>Trait details</Slot>
                    <Slot template={templates.Description}>
                        Tell a bit more about what the trait should be in the
                        entity.
                    </Slot>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            defaultValue="@peduarte"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Slot template={templates.SubmitButton} type="submit">
                        Save changes
                    </Slot>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

Root.displayName = 'TraitNamingModal'

export const TraitNamingModal = Object.assign(Root, {
    slots,
})
