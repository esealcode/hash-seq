import React, { memo } from 'react'
import { map } from 'ramda'

type TReactComponent = React.ComponentType<any>

type TSlot<T extends TReactComponent> = React.NamedExoticComponent<
    React.ComponentProps<T>
> & { Component: T }

type TSlotMap<T extends Record<string, TReactComponent>> = {
    [key in keyof T]: TSlot<T[key]>
}

type TTemplate<T extends TSlot<TReactComponent>> = {
    props: React.ComponentProps<T['Component']> | null
    Component: T['Component']
}

type TTemplateMap<T extends TSlotMap<Record<string, TReactComponent>>> = {
    [key in keyof T]: TTemplate<T[key]>
}

export const createSlots = <T extends Record<string, TReactComponent>>(
    opts: T
) => {
    const templates = map((Component) => {
        const template = memo<React.ComponentProps<typeof Component>>(
            (props) => {
                return null
            }
        )

        template.displayName = `template.${
            Component.displayName ?? 'anonymous'
        }`

        return Object.assign(template, { Component })
    }, opts) as unknown as TSlotMap<T>

    return templates
}

export const useSlots = <
    T extends TSlotMap<Record<string, TReactComponent>>,
    P extends React.PropsWithChildren
>(
    opts: {
        slots: T
    } & Omit<P, 'slots'>
) => {
    const children = React.Children.toArray(opts.children)
    const templates: TTemplateMap<T> = map((slot) => {
        const child = children
            .filter((child) => typeof child === 'object' && 'type' in child)
            .find((child) => child.type === slot)

        return { props: child?.props ?? null, Component: slot.Component }
    }, opts.slots)

    return { templates }
}

type TSlotOwnProps<C extends TReactComponent> = {
    template: TTemplate<TSlot<C>>
    fallback?: boolean
    merge?: (
        props: NonNullable<TTemplate<TSlot<C>>['props']>
    ) => Partial<NonNullable<TTemplate<TSlot<C>>['props']>>
}

type TSlotTemplateProps<
    C extends TReactComponent,
    T extends TTemplate<TSlot<C>>
> = Partial<Omit<NonNullable<T['props']>, keyof TSlotOwnProps<C>>>

export const Slot = <
    C extends React.ComponentType<any>,
    P extends React.ComponentProps<C>,
    T extends TTemplate<TSlot<React.ComponentType<P>>>
>(
    props: TSlotOwnProps<React.ComponentType<P>> &
        TSlotTemplateProps<React.ComponentType<P>, T>
) => {
    const { template, merge, ...restProps } = props

    if (template.props === null) {
        return null
    }

    const mergeProps = merge
        ? merge(template.props)
        : ({} as Partial<T['props']>)

    return (
        <template.Component
            {...restProps}
            {...template.props}
            {...mergeProps}
        />
    )
}
