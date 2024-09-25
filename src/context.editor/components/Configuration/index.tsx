import { memo } from 'react'

import { Dictionnary } from './Dictionnary'
import { Separator } from '@/components/ui/separator'
import { MinMaxWords } from './MinMaxWords'
import { Strict } from './Strict'

export const Configuration = memo((props) => {
    return (
        <div className="flex flex-col gap-8">
            <Separator />
            <Strict />
            <Separator />
            <Dictionnary />
        </div>
    )
})

Configuration.displayName = 'Configuration'
