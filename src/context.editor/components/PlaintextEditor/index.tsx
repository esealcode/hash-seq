'use client'

import { memo, useRef, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { last } from 'lodash'

import { FormField } from '@/components/ui/form'
import { Typo } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { useProofForm } from '@/context.editor/hooks/useProofForm'
import { Textarea } from '@/components/ui/textarea'
import { WordHint } from './WordHint'
import { sequencer } from '@/context.editor/util/sequencer'
import { cn } from '@/lib/utils'
import { manualForwardRef } from '@/context.editor/util/react'

export const PlaintextEditor = memo<{}>((props) => {
    const form = useProofForm()
    const strict = useWatch({ control: form.control, name: 'config.strict' })
    const contract = useWatch({ control: form.control, name: 'contract' })
    const plaintext = useWatch({ control: form.control, name: 'plaintext' })
    const dictionnary = useWatch({
        control: form.control,
        name: 'config.dictionnary',
    })

    const words = useMemo(
        () => dictionnary.split(/\n|\r\n/).filter((word) => word.length > 0),
        [dictionnary]
    )
    const { sequence, expect, strength, trust } = useMemo(() => {
        return sequencer({
            type: 'self-inferring',
            bind: contract,
            plaintext,
            //words,
            strict,
        })
    }, [contract, plaintext, words, strict])

    console.debug(`@plaintext`, { sequence, expect, strength })

    const currentMatch = sequence[sequence.length - 1]
    const wordUsageCountExpectation = Math.ceil(
        Math.log2(2 ** 128) / Math.log2(words.length)
    )

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Typo.text>
                    Use the word:{' '}
                    <Typo.strong>
                        {expect.map((token) => token.raw).join(' ')}
                    </Typo.strong>
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
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center justify-center flex-wrap">
                    {sequence.map((token, index) => {
                        return (
                            <WordHint
                                key={index}
                                className={cn('bg-emerald-400', {
                                    'w-4 bg-neutral-900':
                                        index === sequence.length - 1,
                                    'bg-red-500': token.error,
                                })}
                            />
                        )
                    })}
                    {[
                        ...Array(
                            Math.max(
                                wordUsageCountExpectation - sequence.length,
                                0
                            )
                        ),
                    ].map((_, key) => {
                        return (
                            <WordHint
                                key={key}
                                className={cn('bg-slate-400', {})}
                            />
                        )
                    })}
                </div>
                {currentMatch?.error ? (
                    <Typo.text className="text-end text-red-500">
                        Unexpected token "
                        {currentMatch.got.map((token) => token.raw).join(' ')}"
                        at{' '}
                        <Button
                            variant="link"
                            size="link"
                            className="text-red-500"
                            onClick={() => {
                                console.debug(`select`, { textareaRef })
                                textareaRef.current?.setSelectionRange(
                                    currentMatch.got[0].indices.start,
                                    currentMatch.got[
                                        currentMatch.got.length - 1
                                    ].indices.end
                                )
                                textareaRef.current?.focus()
                            }}
                        >
                            {currentMatch.got[0].indices.start}:
                            {
                                currentMatch.got[currentMatch.got.length - 1]
                                    .indices.end
                            }
                        </Button>
                        , expected "
                        {currentMatch.expect
                            .map((token) => token.raw)
                            .join(' ')}
                        ".
                    </Typo.text>
                ) : null}
            </div>
        </div>
    )
})

PlaintextEditor.displayName = 'PlaintextEditor'
