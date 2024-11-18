'use client'

import { memo } from 'react'
import { useWatch } from 'react-hook-form'
import { Ellipsis } from 'lucide-react'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SettingsDropdown } from './SettingsDropdown'
import { TraitEditor } from '../TraitEditor'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const TraitCard = memo<{
    traitId: string
}>((props) => {
    const { traitId } = props

    const form = useConfigurationForm()
    const trait = useWatch({ control: form.control, name: `traits.${traitId}` })

    return (
        <Card className="flex flex-col w-[calc(340rem/16)] shrink-0 grow-0">
            <CardHeader>
                <div className="flex gap-2">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle>
                            {trait.name.length > 0 ? trait.name : 'Untitled'}
                        </CardTitle>
                        <CardDescription>
                            A required trait that will need to be embedded in
                            the entity.
                        </CardDescription>
                    </div>
                    <div>
                        <SettingsDropdown traitId={traitId}>
                            <SettingsDropdown.Trigger>
                                <Button variant="outline" size="icon-sm">
                                    <Ellipsis className="w-4 h-4" />
                                </Button>
                            </SettingsDropdown.Trigger>
                        </SettingsDropdown>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <TraitEditor traitId={traitId} />
            </CardContent>
        </Card>
    )
})

TraitCard.displayName = 'TraitCard'
