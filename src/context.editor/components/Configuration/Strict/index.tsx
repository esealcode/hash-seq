import { memo } from 'react'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Typo } from '@/components/ui/typography'
import { Switch } from '@/components/ui/switch'
import { ComboSwitch } from '@/components/ui/combo-switch'
import { useProofForm } from '@/context.editor/hooks/useProofForm'
export const Strict = memo((props) => {
    const form = useProofForm()

    return (
        <div>
            <FormField
                control={form.control}
                name="config.strict"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <div className="flex">
                            <ComboSwitch.Label>
                                <FormLabel>Use strict mode</FormLabel>
                            </ComboSwitch.Label>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-readonly
                                />
                            </FormControl>
                        </div>
                        <ComboSwitch.Hint>
                            In strict mode, what you write before the next
                            sentence will impact the generation of its random
                            word count. It is more restrictive but provide
                            integrity checking.
                        </ComboSwitch.Hint>
                    </FormItem>
                )}
            />
        </div>
    )
})

Strict.displayName = 'Strict'
