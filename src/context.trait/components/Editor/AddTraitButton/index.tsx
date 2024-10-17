'use client'

import { memo } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TypeDropdown } from './TypeDropdown'

export const AddTraitButton = memo((props) => {
    return (
        <TypeDropdown>
            <TypeDropdown.Trigger>
                <Button color="primary" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add trait
                </Button>
            </TypeDropdown.Trigger>
        </TypeDropdown>
    )
})
AddTraitButton.displayName = 'AddTraitButton'
