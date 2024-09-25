'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
            'relative group duration-150 transition-background rounded-full px-[calc(3rem/16)] bg-[#00000010] aria-checked:bg-[#222] dark:bg-[#ffffff10] dark:aria-checked:bg-[hsl(150deg,49%,60%)] w-[calc(40rem/16)] h-[calc(24rem/16)] data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed aria-checked:focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-current',
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'pointer-events-none',
                'absolute top-1/2 -translate-y-1/2 block duration-150 transition-all w-[calc(18rem/16)] h-[calc(18rem/16)] rounded-[9999px] bg-[#fff] group-data-[state=checked]:right-[calc(4rem/16)] group-active:w-[calc(22rem/16)]'
            )}
        />
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
