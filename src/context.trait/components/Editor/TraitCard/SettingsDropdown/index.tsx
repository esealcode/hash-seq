import React, { memo } from 'react'
import { nanoid } from 'nanoid'
import { useWatch } from 'react-hook-form'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

const _SettingsDropdown = memo<React.PropsWithChildren<{ traitId: string }>>(
    (props) => {
        const { traitId } = props
        const form = useConfigurationForm()
        const traits = useWatch({ control: form.control, name: 'traits' })

        return (
            <DropdownMenu>
                {props.children}
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        onClick={() => {
                            const { [traitId]: removedTrait, ...rest } = traits

                            form.setValue('traits', {
                                ...rest,
                            })
                        }}
                    >
                        Delete
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => {
                            form.setValue(`traits.${nanoid()}`, {
                                ...traits[traitId],
                            })
                        }}
                    >
                        Duplicate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
)

_SettingsDropdown.displayName = 'SettingsDropdown'

export const SettingsDropdown = Object.assign(_SettingsDropdown, {
    Trigger: DropdownMenuTrigger,
})
