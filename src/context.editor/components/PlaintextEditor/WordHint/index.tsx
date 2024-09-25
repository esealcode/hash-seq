'use client'

import React, { memo } from 'react'

import { cn } from '@/lib/utils'

export const WordHint = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props

    return (
        <div
            className={cn('h-1 w-2 rounded-[9999px] transition-all', className)}
            {...restProps}
        />
    )
})

WordHint.displayName = 'WordHint'
