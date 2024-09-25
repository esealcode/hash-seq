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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ComboSwitch } from '@/components/ui/combo-switch'
import { useProofForm } from '@/context.editor/hooks/useProofForm'

export const Dictionnary = memo((props) => {
    const form = useProofForm()

    const dictionnary = useWatch({
        control: form.control,
        name: 'config.dictionnary',
    })
    const wordCount = dictionnary
        .split(/\r\n|\r|\n/)
        .filter((word) => word.length > 0).length

    return (
        <div className="flex flex-col gap-4">
            <FormField
                control={form.control}
                name="config.dictionnary"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Dictionnary</FormLabel>
                        <FormControl>
                            <Textarea
                                className="max-h-[calc(300rem/16)] h-[calc(300rem/16)]"
                                placeholder="A line separated list of words that will be randomly chosen as next word to use."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div>
                <Typo.text>
                    It will take a minimum of{' '}
                    <Typo.strong>
                        {Math.ceil(Math.log2(2 ** 128) / Math.log2(wordCount))}{' '}
                    </Typo.strong>
                    words to ensure a robust bind. ({wordCount})
                </Typo.text>
            </div>
        </div>
    )
})

Dictionnary.displayName = 'Dictionnary'
