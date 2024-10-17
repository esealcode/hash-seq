import { createPrng } from '@/common/util/prng'
import { TConfiguration } from '../_domain/types.editor.model'

export const generator = (opts: { configuration: TConfiguration }) => {
    const prng = createPrng({
        seed: `${opts.configuration.binding}`,
    })
}
