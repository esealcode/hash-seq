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
    useDropdownController,
    TDropdownController,
} from '@/components/ui/dropdown-menu'
import { UpdateTraitModal } from '../../UpdateTraitModal'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

const RenameDropdownItem = memo<{
    traitId: string
    controller: TDropdownController
}>((props) => {
    const { traitId, controller } = props
    const form = useConfigurationForm()
    const trait = useWatch({ control: form.control, name: `traits.${traitId}` })

    return (
        <UpdateTraitModal
            data={{ name: trait.name, description: trait.description }}
            onOpenChange={controller.onOpenChange}
            onSubmit={(data) => {
                controller.onOpenChange(false)
                form.setValue(`traits.${traitId}`, {
                    ...trait,
                    name: data.name,
                    description: data.description,
                })
            }}
        >
            <UpdateTraitModal.slots.Trigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Rename
                </DropdownMenuItem>
            </UpdateTraitModal.slots.Trigger>
            <UpdateTraitModal.slots.Title>
                Rename trait
            </UpdateTraitModal.slots.Title>
            <UpdateTraitModal.slots.Description />
            <UpdateTraitModal.slots.SubmitButton>
                Update
            </UpdateTraitModal.slots.SubmitButton>
        </UpdateTraitModal>
    )
})

RenameDropdownItem.displayName = 'SettingsDropdownRenameDropdownItem'

const _SettingsDropdown = memo<React.PropsWithChildren<{ traitId: string }>>(
    (props) => {
        const { traitId } = props
        const form = useConfigurationForm()
        const traits = useWatch({ control: form.control, name: 'traits' })
        const controller = useDropdownController()

        return (
            <DropdownMenu modal={false} {...controller}>
                {props.children}
                <DropdownMenuContent align="start">
                    <RenameDropdownItem
                        traitId={traitId}
                        controller={controller}
                    />

                    <DropdownMenuItem
                        onClick={() => {
                            form.setValue(`traits.${nanoid()}`, {
                                ...traits[traitId],
                            })
                        }}
                    >
                        Duplicate
                    </DropdownMenuItem>
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
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
)

_SettingsDropdown.displayName = 'SettingsDropdown'

export const SettingsDropdown = Object.assign(_SettingsDropdown, {
    Trigger: DropdownMenuTrigger,
})
