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

const _TypeDropdown = memo<React.PropsWithChildren>((props) => {
    const form = useConfigurationForm()
    const traits = useWatch({ control: form.control, name: 'traits' })

    return (
        <DropdownMenu>
            {props.children}
            <DropdownMenuContent align="start">
                <DropdownMenuItem
                    onClick={() => {
                        form.setValue('traits', {
                            ...traits,
                            [nanoid()]: {
                                name: '',
                                count: 1,
                                noRepeat: false,
                                strictOrder: false,
                                options: {
                                    type: 'list',
                                    list: '',
                                },
                            },
                        })
                    }}
                >
                    Default
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

_TypeDropdown.displayName = 'TypeDropdown'

export const TypeDropdown = Object.assign(_TypeDropdown, {
    Trigger: DropdownMenuTrigger,
})
