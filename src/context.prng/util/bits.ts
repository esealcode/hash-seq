import { FixedLengthArray } from '@/common/util/types'

export const segmentBigInt = <N extends number>(opts: {
    value: bigint
    segmentSize: number
    segmentCount: N
}) => {
    const segments: bigint[] = []
    let state = opts.value

    for (let i = 0; i < opts.segmentCount; i++) {
        const segment = state & 0xffffffffffffffffn
        segments.push(segment)

        state >>= BigInt(opts.segmentSize)
    }

    return segments as FixedLengthArray<bigint, N>
}
