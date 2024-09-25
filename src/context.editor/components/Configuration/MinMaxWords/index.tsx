import { memo } from 'react'
import { useWatch } from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Typo } from '@/components/ui/typography'
import { Slider } from '@/components/ui/slider'
import { useProofForm } from '@/context.editor/hooks/useProofForm'

export const MinMaxWords = memo((props) => {
    const form = useProofForm()

    const minWords = useWatch({
        control: form.control,
        name: 'config.minWordsPerSentence',
    })

    const maxWords = useWatch({
        control: form.control,
        name: 'config.maxWordsPerSentence',
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4">
                <FormField
                    control={form.control}
                    name="config.minWordsPerSentence"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>
                                Min. words: <strong>{minWords}</strong>
                            </FormLabel>
                            <FormControl>
                                <Slider
                                    defaultValue={[6]}
                                    min={1}
                                    max={128}
                                    value={
                                        field.value !== undefined
                                            ? [field.value]
                                            : undefined
                                    }
                                    onValueChange={(range) => {
                                        field.onChange(range[0])
                                        // see: https://github.com/react-hook-form/resolvers/issues/661
                                        setTimeout(() => {
                                            form.trigger()
                                        }, 0)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="config.maxWordsPerSentence"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>
                                Max. words: <strong>{maxWords}</strong>
                            </FormLabel>
                            <FormControl>
                                <Slider
                                    defaultValue={[32]}
                                    min={1}
                                    max={128}
                                    value={
                                        field.value !== undefined
                                            ? [field.value]
                                            : undefined
                                    }
                                    onValueChange={(range) => {
                                        field.onChange(range[0])
                                        setTimeout(() => {
                                            form.trigger()
                                        }, 0)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <Typo.text>
                    It will take a minimum of{' '}
                    <Typo.strong>
                        {Math.ceil(
                            Math.log2(2 ** 128) /
                                Math.log2(maxWords - minWords + 1)
                        )}{' '}
                    </Typo.strong>
                    sentences to ensure a robust proof.
                </Typo.text>
            </div>
        </div>
    )
})

MinMaxWords.displayName = 'MinMaxWords'
