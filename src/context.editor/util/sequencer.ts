import * as R from 'ramda'

import { createPrng } from './prng'
import { tokenizeText, isTokenListEqual, TToken } from './parse'

type TSequenceTokenMatch = {
    expect: TToken[]
    got: TToken[]
    error: boolean
}

export const sequencer = (opts: {
    contract: string
    plaintext: string
    words: string[]
    strict?: boolean
}) => {
    let prng = createPrng({ seed: opts.contract })

    const acceptedTokenLists = opts.words.map((text) => tokenizeText({ text }))

    const tokens = tokenizeText({ text: opts.plaintext })
    console.debug(`@tokens`, tokenizeText({ text: opts.plaintext }))

    const generateNextTokenList = () =>
        acceptedTokenLists[Number(prng.random(0, opts.words.length - 1))]

    const sequence: TSequenceTokenMatch[] = []

    let expectTokenList = generateNextTokenList()
    let i = 0

    while (i < tokens.length) {
        const token = tokens[i]
        const isMatching = isTokenListEqual(
            expectTokenList,
            tokens.slice(i, i + expectTokenList.length)
        )
        const otherAcceptedTokenListMatch = acceptedTokenLists.find(
            (tokenList) =>
                isTokenListEqual(
                    tokenList,
                    tokens.slice(i, i + tokenList.length)
                )
        )

        if (!isMatching && otherAcceptedTokenListMatch !== undefined) {
            // Failure at...
            sequence.push({
                expect: expectTokenList,
                got: tokens.slice(i, i + otherAcceptedTokenListMatch.length),
                error: true,
            })

            break
        }

        if (isMatching) {
            if (opts.strict) {
                prng = createPrng({
                    seed: `${opts.contract}${opts.plaintext.slice(
                        0,
                        token.indices.start
                    )}`,
                })
            }

            sequence.push({
                expect: expectTokenList,
                got: tokens.slice(i, i + expectTokenList.length),
                error: false,
            })

            i += expectTokenList.length
            expectTokenList = generateNextTokenList()

            continue
        }

        i++
    }

    return {
        sequence,
        expect: expectTokenList,
    }
}
