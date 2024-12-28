'use client'

import { memo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useDialogController } from '@/components/ui/dialog'
import { CreateTraitSheet } from '../CreateTraitSheet'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const AddTraitButton = memo((props) => {
    const dialogController = useDialogController()
    const form = useConfigurationForm()

    return (
        <CreateTraitSheet
            {...dialogController}
            onSubmit={(data) => {
                const id = nanoid()

                switch (data.type) {
                    case 'range':
                        form.setValue(`traits.${id}`, {
                            name: data.name,
                            description: data.description,
                            noRepeat: false,
                            strictOrder: false,
                            count: 0,
                            options: {
                                type: 'range',
                                min: 0,
                                max: 0,
                            },
                        })
                        break

                    case 'list':
                    default:
                        form.setValue(`traits.${id}`, {
                            name: data.name,
                            description: data.description,
                            noRepeat: false,
                            strictOrder: false,
                            count: 0,
                            options: {
                                type: 'list',
                                list: '',
                            },
                        })
                }
                dialogController.onOpenChange(false)
            }}
        >
            <CreateTraitSheet.slots.Trigger>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add trait
                </Button>
            </CreateTraitSheet.slots.Trigger>
            <CreateTraitSheet.slots.Title>
                Add trait
            </CreateTraitSheet.slots.Title>
            <CreateTraitSheet.slots.Description />
            <CreateTraitSheet.slots.SubmitButton>
                Create
            </CreateTraitSheet.slots.SubmitButton>
        </CreateTraitSheet>
    )
})
AddTraitButton.displayName = 'AddTraitButton'
