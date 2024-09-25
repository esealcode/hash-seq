const TOKEN_REGEXP = /(?<=[\?\:\.\(\[, \n]*)[\w'-]+(?=[\?\:\.\)\], \n]*)/g

export type TToken = {
    raw: string
    token: string
    indices: {
        start: number
        end: number
    }
}

export const tokenizeText = (opts: { text: string }) => {
    const regex = RegExp(TOKEN_REGEXP)

    const tokens: TToken[] = []

    while (true) {
        const match = regex.exec(opts.text)
        if (match === null) {
            break
        }

        tokens.push({
            raw: match[0],
            token: match[0].toLowerCase(),
            indices: {
                start: match.index,
                end: match.index + match[0].length,
            },
        })
    }

    return tokens
}

export const isTokenListEqual = (left: TToken[], right: TToken[]) => {
    return left.every(
        (token, index) =>
            right[index] !== undefined && right[index].token === token.token
    )
}
