'use client'

import { memo, useMemo, useEffect, useRef } from 'react'
import { useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Typo } from '@/components/ui/typography'
import { useProofForm } from '@/context.editor/hooks/useProofForm'
import { sequencer } from '@/context.editor/util/sequencer'

export const PlaintextEditor = memo<{}>((props) => {
    const form = useProofForm()
    const contract = useWatch({ control: form.control, name: 'contract' })
    const plaintext = useWatch({ control: form.control, name: 'plaintext' })
    const skipMap = useWatch({ control: form.control, name: 'skipMap' })

    const {
        acceptedTokenLists,
        sequence,
        expect,
        strength,
        trust,
        outSkipMap,
    } = useMemo(() => {
        return sequencer({
            bind: contract,
            plaintext,
            skipMap,
        })
    }, [contract, plaintext, skipMap])

    const TARGET_STRENGTH = 2 ** 128
    const hasReachedTarget = strength >= TARGET_STRENGTH
    const expectedRemainingWordCount = Math.ceil(
        Math.log2(2 ** 128) /
            Math.log2(strength) /
            Math.log2(acceptedTokenLists.length)
    )

    const progress =
        expectedRemainingWordCount > 0
            ? (
                  Math.min(
                      sequence.length /
                          (sequence.length + expectedRemainingWordCount),
                      1
                  ) * 100
              ).toFixed(2)
            : 0

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    console.debug(`@seq`, { outSkipMap })
    useEffect(() => {
        form.setValue('skipMap', outSkipMap.join(''))
    }, [outSkipMap, form.setValue])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Typo.text>
                    Use the word:{' '}
                    <Typo.strong>
                        {expect
                            ? expect.map((token) => token.raw).join(' ')
                            : null}
                    </Typo.strong>
                    <Button
                        variant="link"
                        size="link"
                        className="ml-2"
                        onClick={() => {
                            form.setValue('skipMap', `${skipMap}.`)
                        }}
                    >
                        Skip
                    </Button>
                </Typo.text>
                <FormField
                    control={form.control}
                    name="plaintext"
                    render={({ field }) => {
                        return (
                            <Textarea
                                className="w-fulll h-[calc(400rem/16)]"
                                placeholder="Write here..."
                                {...field}
                                ref={(e) => {
                                    field.ref(e)
                                    textareaRef.current = e
                                }}
                            />
                        )
                    }}
                />
            </div>
            <div>
                <FormField
                    control={form.control}
                    name="skipMap"
                    render={({ field }) => {
                        return (
                            <Input
                                placeholder="Skip map, e.g: --.------.---..-"
                                {...field}
                            />
                        )
                    }}
                />
            </div>
            <div className="flex flex-col gap-4">
                <Typo.text>
                    Bind:{' '}
                    <Typo.strong>
                        {hasReachedTarget ? '100' : progress}% (trust:{' '}
                        {(trust * 100).toFixed(2)}%)
                    </Typo.strong>
                </Typo.text>
            </div>
        </div>
    )
})

PlaintextEditor.displayName = 'PlaintextEditor'
