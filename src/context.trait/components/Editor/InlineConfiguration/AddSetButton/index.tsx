'use client'

import { memo } from 'react'
import { nanoid } from 'nanoid'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

function nextDefaultSetName(
    setCards: Record<string, { name: string }> | undefined
): string {
    const used = new Set(
        Object.values(setCards ?? {}).map((c) => c.name.trim())
    )
    const base = 'New set'
    if (!used.has(base)) {
        return base
    }
    let n = 2
    while (used.has(`${base} ${n}`)) {
        n += 1
    }
    return `${base} ${n}`
}

export const AddSetButton = memo(() => {
    const form = useConfigurationForm()

    return (
        <div className="flex w-[calc(340rem/16)] shrink-0 grow-0 self-stretch">
            <Button
                type="button"
                variant="ghost"
                className="flex h-full min-h-[10rem] w-full items-center justify-center rounded-md bg-transparent text-muted-foreground hover:!bg-transparent hover:text-foreground active:!bg-transparent focus-visible:!bg-transparent"
                onClick={() => {
                    const id = nanoid()
                    const setCards = form.getValues('setCards')
                    form.setValue(`setCards.${id}`, {
                        name: nextDefaultSetName(setCards),
                        options: {
                            type: 'list',
                            list: '',
                        },
                    })
                }}
                aria-label="Add set"
            >
                <Plus className="h-6 w-6" />
            </Button>
        </div>
    )
})
AddSetButton.displayName = 'AddSetButton'
