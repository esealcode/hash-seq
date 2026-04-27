'use client'

import { memo } from 'react'
import { useWatch } from 'react-hook-form'
import { Ellipsis } from 'lucide-react'

import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SettingsDropdown } from './SettingsDropdown'
import { SetEditor } from '../SetEditor'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const SetCard = memo<{
    setId: string
}>((props) => {
    const { setId } = props
    const form = useConfigurationForm()
    const card = useWatch({
        control: form.control,
        name: `setCards.${setId}`,
    })

    return (
        <Card className="flex flex-col w-[calc(340rem/16)] shrink-0 grow-0">
            <CardHeader className="space-y-1.5">
                <FormField
                    control={form.control}
                    name={`setCards.${setId}.name`}
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="sr-only">Set name</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl className="flex-1 min-w-0">
                                    <Input
                                        className="text-base font-semibold"
                                        placeholder="Set name"
                                        {...field}
                                    />
                                </FormControl>
                                <SettingsDropdown setId={setId}>
                                    <SettingsDropdown.Trigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0"
                                        >
                                            <Ellipsis className="h-4 w-4" />
                                        </Button>
                                    </SettingsDropdown.Trigger>
                                </SettingsDropdown>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <CardDescription>
                    Use{' '}
                    <span className="font-mono text-foreground/80">
                        {card?.name?.trim() || '…'}
                    </span>{' '}
                    in entity lines
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <SetEditor setId={setId} />
            </CardContent>
        </Card>
    )
})

SetCard.displayName = 'SetCard'
