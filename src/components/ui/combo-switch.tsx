import React, { memo } from 'react'

import { Switch } from './switch'
import { cn } from '@/lib/utils'

const Title = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props
    return <div className={cn('mb-3', className)} {...restProps} />
})

Title.displayName = 'ComboSwitchTitle'

const Label = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props

    return (
        <div
            className={cn(
                'block flex-1 mr-3 overflow-hidden whitespace-nowrap text-ellipsis min-w-0 text-sm',
                className
            )}
            {...restProps}
        />
    )
})

Label.displayName = 'ComboSwitchLabel'

const Hint = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props

    return (
        <div
            className={cn('text-sm text-muted-foreground mt-2', className)}
            {...restProps}
        />
    )
})

Hint.displayName = 'ComboSwitchHint'

export const ComboSwitch = Object.assign({
    Title,
    Label,
    Hint,
})
