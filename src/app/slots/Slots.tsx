'use client'
import React, { memo, useState } from 'react'

import { createSlot } from '@/components/ui/slot'

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
    return (
        <div>
            {props.y}
            {props.children}
        </div>
    )
})
Footer.displayName = 'Footer'

const slots = {
    Header: createSlot(Header),
    Footer: createSlot<typeof Footer, { internal: number }>(Footer),
}

slots.Header.Slot

const Page = memo<React.PropsWithChildren>((props) => {
    const { children } = props

    const [internal, setInternal] = useState(0)
    return (
        <div>
            <slots.Header.Slot.If
                scope={children}
                requires={[slots.Footer]}
                exists
            >
                <div>
                    <div>Header</div>
                    <slots.Header.Slot $scope={children} x={0} />
                </div>
            </slots.Header.Slot.If>
            <div>Footer</div>
            <slots.Footer.Slot $scope={children} $data={{ internal }} y={0} />
            <button type="button" onClick={() => setInternal(internal + 1)}>
                Add
            </button>
            {children}

            <slots.Header.Slot $name="dynamic" $scope={children} x={10} />
            <slots.Footer.Slot
                $name="dynamic-data"
                $scope={children}
                $data={{ internal }}
                y={0}
            />
        </div>
    )
})

Page.displayName = 'Page'

export default function App() {
    return (
        <Page>
            <slots.Header x={10} />
            <slots.Footer.Receiver>
                {(data) => (
                    <slots.Footer y={10}>
                        <div>Received {data.internal}</div>
                    </slots.Footer>
                )}
            </slots.Footer.Receiver>
            <slots.Header $name="dynamic" x={20} />
            <slots.Footer.Receiver $name="dynamic-data">
                {(data) => (
                    <slots.Footer y={40}>
                        <div>Received dynamic {data.internal}</div>
                    </slots.Footer>
                )}
            </slots.Footer.Receiver>
            <div>classic</div>
        </Page>
    )
}
