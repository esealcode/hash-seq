import { useState } from 'react'
import { useDebounce, useMount } from 'react-use'
import { useEventListener } from 'usehooks-ts'
import {
    compressStringToGzip,
    decompressGzipToString,
} from '@/common/util/gzip'

import {
    TConfiguration,
    configurationSchema,
} from '../_domain/types.editor.model'

export const usePayloadHash = (opts: {
    config: TConfiguration
    onPayloadChange?: (config: TConfiguration) => void
}) => {
    const { config, onPayloadChange } = opts

    const [payload, setPayload] = useState(config)

    // @todo: avoid unnecessary lifecycles

    const handleHash = async (opts: { hash: string }) => {
        const { hash } = opts
        const payload = await decompressGzipToString(
            new Uint8Array(Buffer.from(hash, 'base64'))
        )

        try {
            const data = JSON.parse(payload)
            const parse = configurationSchema.safeParse(data)
            if (!parse.success) {
                throw parse.error
            }

            setPayload(parse.data)
            onPayloadChange?.(parse.data)
        } catch (e) {
            console.error(e)
        }
    }

    useMount(() => {
        handleHash({ hash: window.location.hash })
    })

    useEventListener('hashchange', (e) =>
        handleHash({ hash: window.location.hash })
    )

    useDebounce(
        async () => {
            const validation = configurationSchema.safeParse(config)
            if (!validation.success) {
                return
            }

            const compressed = await compressStringToGzip(
                JSON.stringify(config)
            )
            window.location.hash = Buffer.from(compressed).toString('base64')
        },
        300,
        [config]
    )

    return { payload }
}
