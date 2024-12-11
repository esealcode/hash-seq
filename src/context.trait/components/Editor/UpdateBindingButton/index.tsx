'use client'

import { memo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Scale } from 'lucide-react'
import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useDialogController } from '@/components/ui/dialog'
import { UpdateBindingSheet } from '../UpdateBindingSheet'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const UpdateBindingButton = memo((props) => {
    const dialogController = useDialogController()
    const form = useConfigurationForm()

    const rules = useWatch({ control: form.control, name: 'binding' })

    return (
        <UpdateBindingSheet
            {...dialogController}
            data={{ rules }}
            onSubmit={(data) => {
                form.setValue('binding', data.rules)
                dialogController.onOpenChange(false)
            }}
        >
            <UpdateBindingSheet.slots.Trigger asChild>
                <Button variant="outline">
                    <Scale className="mr-2 h-4 w-4" />
                    Binding
                </Button>
            </UpdateBindingSheet.slots.Trigger>
            <UpdateBindingSheet.slots.Title />
            <UpdateBindingSheet.slots.Description />
            <UpdateBindingSheet.slots.SubmitButton />
        </UpdateBindingSheet>
    )
})

UpdateBindingButton.displayName = 'UpdateBindingButton'
