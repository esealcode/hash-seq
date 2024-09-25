'use client'

import { memo } from 'react'
import hash from 'hash.js'

import { FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useProofForm } from '@/context.editor/hooks/useProofForm'

export const ContractEditor = memo<{}>((props) => {
    const form = useProofForm()

    console.debug(`@hash`, { hash: hash.sha256().update('abc').digest('hex') })
    return (
        <FormField
            control={form.control}
            name="contract"
            render={({ field }) => {
                return (
                    <Textarea
                        className="w-full min-h-[calc(200rem/16)] max-h-[calc(400rem/16)]"
                        placeholder="A contract is the root of your "
                        {...field}
                    />
                )
            }}
        />
    )
})

ContractEditor.displayName = 'ContractEditor'
