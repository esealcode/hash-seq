import hash from 'hash.js'

export const bigIntSha256 = (input: string) => {
    return BigInt(`0x${hash.sha256().update(input).digest('hex')}`)
}
