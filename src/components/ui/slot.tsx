import React, { memo } from 'react'
import invariant from 'invariant'

export type TSlotScope = React.PropsWithChildren['children']

type TSlot<
    C extends React.ComponentType<any>,
    D extends Record<string, any> | undefined
> = React.NamedExoticComponent<React.ComponentProps<C> & { $name?: string }> & {
    Slot: React.NamedExoticComponent<
        TSlotInternalProps<C, D> &
            Omit<React.ComponentProps<C>, keyof TSlotInternalProps<C, D>>
    > & {
        If: React.NamedExoticComponent<TSlotIfProps>
    }

    Receiver: React.NamedExoticComponent<{
        $name?: string
        children: (
            props: D
        ) => React.ReactElement<
            unknown,
            string | React.JSXElementConstructor<any>
        >
    }>
}

const useTemplates = <
    C extends React.ComponentType<any>,
    D extends Record<string, any> | undefined
>(opts: {
    $scope: React.PropsWithChildren['children']
    $data: D | undefined
    $name?: string
    Receiver: TSlot<C, D>['Receiver']
    type: C
}) => {
    const templates = React.Children.toArray(opts.$scope)
        .filter((child) => React.isValidElement(child))
        .filter((child) => {
            const props = child.props as Record<string, any> | null

            const isType =
                child.type === opts.type || child.type === opts.Receiver

            const isNameMatching =
                (!opts.$name && !props?.$name) || opts.$name === props?.$name

            return isType && isNameMatching
        })
        .map((template) => {
            if (template.type !== opts.Receiver) {
                return template
            }

            invariant(
                opts.$data !== undefined,
                'Cannot render consumer template, data is undefined'
            )

            const templateProps = template.props as Record<string, any> | null

            invariant(
                templateProps !== null,
                'Slot Receiver did not receive any children'
            )

            const render = templateProps.children as React.ComponentProps<
                TSlot<C, D>['Receiver']
            >['children']

            invariant(
                typeof render === 'function',
                'Slot Receiver did not receive render function children'
            )

            const children = render(opts.$data)

            invariant(
                React.Children.toArray(children).every(
                    (child) =>
                        React.isValidElement(child) && child.type === opts.type
                ),
                'Slot receiver render function did not return expected slot type'
            )
            return children
        })

    return templates
}

type TSlotInternalDataProps<D extends Record<string, any> | undefined> =
    D extends undefined
        ? { $data?: never }
        : {
              $data: D
          }

type TSlotInternalProps<
    C extends React.ComponentType<any>,
    D extends Record<string, any> | undefined
> = {
    $scope: React.PropsWithChildren['children']
    $multiple?: boolean
    $name?: string
    $merge?: (
        props: React.ComponentProps<C>
    ) => Partial<React.ComponentProps<C>>
} & TSlotInternalDataProps<D>

type TSlotIfProps = React.PropsWithChildren<{
    $name?: string
    scope: React.PropsWithChildren['children']
    requires?: React.ComponentType<any>[]
    exists?: boolean
}>

const createSlotComponent = <
    C extends React.ComponentType<any>,
    D extends Record<string, any> | undefined
>(opts: {
    Component: C
    Receiver: TSlot<C, D>['Receiver']
    Template: React.ComponentType<React.ComponentProps<C>>
}) => {
    const { Component, Receiver, Template } = opts

    const Slot = memo<
        React.PropsWithChildren<
            TSlotInternalProps<C, D> &
                Omit<React.ComponentProps<C>, keyof TSlotInternalProps<C, D>>
        >
    >((props) => {
        const {
            $scope,
            $name,
            $multiple = false,
            $merge,
            $data,
            ...slotsProps
        } = props

        const templates = useTemplates<typeof Template, typeof $data>({
            $scope,
            $name,
            $data,
            type: Template,
            Receiver,
        })

        console.debug(`@templates`, { templates })
        invariant(
            !$multiple && templates.length <= 1,
            'Found multiple templates but slots is single template.'
        )

        return templates.map((template, key) => {
            const templateProps = template.props as React.ComponentProps<
                typeof Component
            >
            const { $name, ...props } = templateProps

            const mergeProps = $merge
                ? $merge(templateProps)
                : ({} as Partial<React.ComponentProps<typeof Component>>)

            return (
                // @ts-expect-error @todo: fix type issue
                <Component
                    key={template.key ?? key}
                    // @ts-ignore @todo: investigate
                    ref={template.ref}
                    {...slotsProps}
                    {...props}
                    {...mergeProps}
                />
            )
        })
    })

    Slot.displayName = `slot.${Component.displayName ?? 'anonymous'}`

    const If = memo<TSlotIfProps>((props) => {
        const { scope, exists, requires = [], children } = props

        const templates = React.Children.toArray(scope)
            .filter((child) => React.isValidElement(child))
            .filter(
                (child) => child.type === Component || child.type === Receiver
            )

        const hasAnyTemplate = templates.length > 0
        const hasExistsRequirement = exists !== undefined
        const failedExistsRequirement =
            hasExistsRequirement &&
            ((exists && !hasAnyTemplate) || (!exists && hasAnyTemplate))

        if (failedExistsRequirement) {
            return null
        }

        const hasRequiredTemplates =
            requires.length > 0 &&
            requires.every((template) =>
                React.Children.toArray(scope).some(
                    (child) =>
                        React.isValidElement(child) && child.type === template
                )
            )

        if (!hasRequiredTemplates) {
            return null
        }

        return children
    })

    If.displayName = `${Slot.displayName}.If`

    return Object.assign(Slot, { If })
}

export const createSlot = <
    C extends React.ComponentType<any>,
    D extends Record<string, any> | undefined = undefined
>(
    Component: C
) => {
    const Template = memo<React.ComponentProps<typeof Component>>((props) => {
        return null
    })

    Template.displayName = `template.${Component.displayName ?? 'anonymous'}`

    const Receiver: TSlot<C, D>['Receiver'] = memo((props) => {
        return null
    })

    Receiver.displayName = `slot.consumer.${
        Component.displayName ?? 'anonymous'
    }`

    const Slot = createSlotComponent<C, D>({
        Component,
        Template,
        Receiver,
    })

    const slot: TSlot<C, D> = Object.assign(Template, {
        Slot,
        Receiver,
    })

    return slot
}

export const createDynamicSlot = <
    D extends Record<string, any> = Record<string, never>
>() => {
    return null
}
