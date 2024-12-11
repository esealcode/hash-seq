import React, { memo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Signature } from '../Signature'

export const SignatureSheet = memo<React.PropsWithChildren>((props) => {
    const { children } = props

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Signature</SheetTitle>
                    <SheetDescription>
                        Track and verify the entity traits requirements.
                    </SheetDescription>
                </SheetHeader>
                <Signature />
            </SheetContent>
        </Sheet>
    )
})

SignatureSheet.displayName = 'SignatureSheet'
