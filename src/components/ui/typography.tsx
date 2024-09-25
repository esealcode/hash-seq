import React, { memo } from 'react'

import { cn } from '@/lib/utils'

const h1 = memo<React.ComponentProps<'h1'>>((props) => {
    const { className, ...restProps } = props
    return (
        <h1
            className={cn(
                'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                className
            )}
            {...restProps}
        />
    )
})

h1.displayName = 'Typo.h1'

const h2 = memo<React.ComponentProps<'h2'>>((props) => {
    const { className, ...restProps } = props
    return (
        <h2
            className={cn(
                'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className
            )}
            {...restProps}
        />
    )
})

h2.displayName = 'Typo.h2'

const h3 = memo<React.ComponentProps<'h3'>>((props) => {
    const { className, ...restProps } = props
    return (
        <h3
            className={cn(
                'scroll-m-20 text-2xl font-semibold tracking-tight',
                className
            )}
            {...restProps}
        />
    )
})

h3.displayName = 'Typo.h3'

const h4 = memo<React.ComponentProps<'h4'>>((props) => {
    const { className, ...restProps } = props
    return (
        <h4
            className={cn(
                'scroll-m-20 text-xl font-semibold tracking-tight',
                className
            )}
            {...restProps}
        />
    )
})

h4.displayName = 'Typo.h4'

const p = memo<React.ComponentProps<'p'>>((props) => {
    const { className, ...restProps } = props
    return (
        <p
            className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
            {...restProps}
        />
    )
})

p.displayName = 'Typo.p'

const blockquote = memo<React.ComponentProps<'blockquote'>>((props) => {
    const { className, ...restProps } = props
    return (
        <blockquote
            className={cn('mt-6 border-l-2 pl-6 italic', className)}
            {...restProps}
        />
    )
})

blockquote.displayName = 'Typo.blockquote'

const inlineCode = memo<React.ComponentProps<'code'>>((props) => {
    const { className, ...restProps } = props
    return (
        <code
            className={cn(
                'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
                className
            )}
            {...restProps}
        />
    )
})

inlineCode.displayName = 'Typo.inlineCode'

const lead = memo<React.ComponentProps<'p'>>((props) => {
    const { className, ...restProps } = props
    return (
        <p
            className={cn('text-xl text-muted-foreground', className)}
            {...restProps}
        />
    )
})

lead.displayName = 'Typo.lead'

const large = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props
    return (
        <div
            className={cn('text-lg font-semibold', className)}
            {...restProps}
        />
    )
})

large.displayName = 'Typo.large'

const small = memo<React.ComponentProps<'small'>>((props) => {
    const { className, ...restProps } = props
    return (
        <small
            className={cn('text-sm font-medium leading-none', className)}
            {...restProps}
        />
    )
})

small.displayName = 'Typo.small'

const muted = memo<React.ComponentProps<'p'>>((props) => {
    const { className, ...restProps } = props
    return (
        <p
            className={cn('text-sm text-muted-foreground', className)}
            {...restProps}
        />
    )
})

muted.displayName = 'Typo.muted'

const strong = memo<React.ComponentProps<'p'>>((props) => {
    const { className, ...restProps } = props
    return <strong className={cn('font-bold', className)} {...restProps} />
})

strong.displayName = 'Typo.strong'

const text = memo<React.ComponentProps<'div'>>((props) => {
    const { className, ...restProps } = props
    return <div className={cn('text-sm', className)} {...restProps} />
})

text.displayName = 'Typo.text'

export const Typo = Object.assign({
    h1,
    h2,
    h3,
    h4,
    p,
    blockquote,
    inlineCode,
    lead,
    large,
    small,
    muted,
    strong,
    text,
})
