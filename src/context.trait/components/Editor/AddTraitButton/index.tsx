'use client'

import { memo } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TraitNamingModal } from '../TraitNamingModal'

export const AddTraitButton = memo((props) => {
    return (
        <TraitNamingModal onSubmit={() => {}}>
            <TraitNamingModal.slots.Trigger>
                <Button color="primary" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add trait
                </Button>
            </TraitNamingModal.slots.Trigger>
            <TraitNamingModal.slots.Title>
                Add trait
            </TraitNamingModal.slots.Title>
            <TraitNamingModal.slots.Description />
            <TraitNamingModal.slots.SubmitButton>
                Create
            </TraitNamingModal.slots.SubmitButton>
        </TraitNamingModal>
    )
})
AddTraitButton.displayName = 'AddTraitButton'
