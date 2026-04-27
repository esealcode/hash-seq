'use client'

import React, { memo } from 'react'
import { nanoid } from 'nanoid'
import { useWatch } from 'react-hook-form'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useDropdownController,
} from '@/components/ui/dropdown-menu'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

const _SettingsDropdown = memo<React.PropsWithChildren<{ setId: string }>>(
    (props) => {
        const { setId } = props
        const form = useConfigurationForm()
        const setCards = useWatch({ control: form.control, name: 'setCards' })
        const controller = useDropdownController()

        return (
            <DropdownMenu modal={false} {...controller}>
                {props.children}
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => {
                            form.setValue(`setCards.${nanoid()}`, {
                                ...setCards[setId],
                            })
                        }}
                    >
                        Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            const { [setId]: _removed, ...rest } = setCards
                            form.setValue('setCards', rest)
                        }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
)

_SettingsDropdown.displayName = 'SetSettingsDropdown'

export const SettingsDropdown = Object.assign(_SettingsDropdown, {
    Trigger: DropdownMenuTrigger,
})
