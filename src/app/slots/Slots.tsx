import React, { memo } from 'react'

import { Slot, createSlots, useSlots } from '@/components/ui/slot'

const Header = memo<React.PropsWithChildren<{ x: number }>>((props) => {
    return (
        <div>
            {props.x}
            {props.children}
        </div>
    )
})
Header.displayName = 'Header'

const Footer = memo<React.PropsWithChildren<{ y: number }>>((props) => {
    return <div>{props.y}</div>
})
Footer.displayName = 'Footer'

const slots = createSlots({
    Header,
    Footer,
})

const Page = memo<React.PropsWithChildren>((props) => {
    const { templates } = useSlots({ slots, ...props })

    return (
        <div>
            <div>Header</div>
            <Slot template={templates.Header} merge={(props) => ({ x: 0 })} />
            <div>Footer</div>
            <Slot template={templates.Footer} />
        </div>
    )
})

Page.displayName = 'Page'

export default function App() {
    return (
        <Page>
            <slots.Header x={10} />
        </Page>
    )
}
