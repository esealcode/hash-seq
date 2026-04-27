'use client'

import { memo } from 'react'
import { nanoid } from 'nanoid'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useDialogController } from '@/components/ui/dialog'
import { CreateSetSheet } from '../CreateSetSheet'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const AddSetButton = memo((props) => {
    const dialogController = useDialogController()
    const form = useConfigurationForm()

    return (
        <CreateSetSheet
            {...dialogController}
            onSubmit={(data) => {
                const id = nanoid()
                form.setValue(`setCards.${id}`, {
                    name: data.name,
                    options: {
                        type: 'list',
                        list: '',
                    },
                })
                dialogController.onOpenChange(false)
            }}
        >
            <CreateSetSheet.slots.Trigger>
                <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> Add set
                </Button>
            </CreateSetSheet.slots.Trigger>
            <CreateSetSheet.slots.Title>Add set</CreateSetSheet.slots.Title>
            <CreateSetSheet.slots.Description />
            <CreateSetSheet.slots.SubmitButton>
                Add set
            </CreateSetSheet.slots.SubmitButton>
        </CreateSetSheet>
    )
})
AddSetButton.displayName = 'AddSetButton'
