import { memo } from 'react'
import { useWatch } from 'react-hook-form'

import { TConfigurationFormData } from '@/context.trait/_domain/types.editor.model'
import { usePayloadHash } from '@/context.trait/hooks/usePayloadHash'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'

export const HashListener = memo((props) => {
    const form = useConfigurationForm()
    const config = useWatch({ control: form.control }) as TConfigurationFormData
    const { payload } = usePayloadHash({
        config,
        onPayloadChange: (config) => {
            form.reset(config)
        },
    })

    console.debug(`@hash`, { payload })
    return null
})

HashListener.displayName = 'HashListener'
