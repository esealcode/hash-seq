'use client'

import { memo, useState } from 'react'
import { nanoid } from 'nanoid'
import { Sigma } from 'lucide-react'
import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { SignatureSheet } from '../SignatureSheet'
import { useDialogController } from '@/components/ui/dialog'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const SignatureButton = memo((props) => {
    const dialogController = useDialogController()
    const form = useConfigurationForm()

    const rules = useWatch({ control: form.control, name: 'binding' })

    return (
        <SignatureSheet>
            <Button variant="outline">
                <Sigma className="mr-2 h-4 w-4" />
                Signature
            </Button>
        </SignatureSheet>
    )
})

SignatureButton.displayName = 'SignatureButton'
