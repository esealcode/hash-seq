export const normalizeBigInt64 = (n: bigint) => {
    const u64 = Number(n & 0xffffffffffffffffn)

    return u64 / 0xffffffffffffffff
}
