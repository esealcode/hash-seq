'use client'

import { memo } from 'react'

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { BindingEditor } from '../BindingEditor'

export const BindingCard = memo((props) => {
    return (
        <Card className="max-w-[calc(340rem/16)] shrink-0 grow-0">
            <CardHeader>
                <CardTitle>Binding</CardTitle>
                <CardDescription>
                    Anything you write here will apply to the text you'll write
                    in the next tab. Be creative!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BindingEditor />
            </CardContent>
        </Card>
    )
})

BindingCard.displayName = 'BindingCard'
