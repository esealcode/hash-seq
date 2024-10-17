import * as R from 'ramda'

import { createPrng } from '../../common/util/prng'
import { tokenizeText, isTokenListEqual, TToken } from './parse'

type TSequenceTokenMatch = {
    expect: TToken[]
    got: TToken[]
}

type TOptions = {
    bind: string
    plaintext: string
    skipMap: string
}

export const sequencer = (opts: TOptions) => {
    let prng = createPrng({ seed: opts.bind })

    const acceptedTokenLists: TToken[][] = []

    const tokens = tokenizeText({ text: opts.plaintext })

    const skipMap = opts.skipMap.split('')
    const outSkipMap: string[] = []

    const generateNextTokenList = () => {
        console.debug(`@generate`)
        if (acceptedTokenLists.length === 0) {
            return null
        }

        while (true) {
            const skipToken = skipMap.shift()

            if (!skipToken || skipToken === '-') {
                break
            }

            const ignore =
                acceptedTokenLists[
                    Number(prng.random(0, acceptedTokenLists.length - 1))
                ]

            wrongTokenListsEncountered.add(ignore)
            outSkipMap.push('.')
        }

        return acceptedTokenLists[
            Number(prng.random(0, acceptedTokenLists.length))
        ]
    }

    const sequence: TSequenceTokenMatch[] = []

    let expectTokenList = generateNextTokenList()
    let i = 0
    let strength = 1
    let trust = 0
    let wrongTokenListsEncountered: Set<TToken[]> = new Set()

    while (i < tokens.length) {
        const token = tokens[i]

        const isMatching = expectTokenList
            ? isTokenListEqual(
                  expectTokenList,
                  tokens.slice(i, i + expectTokenList.length)
              )
            : false

        const otherAcceptedTokenListMatch = acceptedTokenLists.find(
            (tokenList) =>
                isTokenListEqual(
                    tokenList,
                    tokens.slice(i, i + tokenList.length)
                )
        )

        const existingAcceptedToken = acceptedTokenLists.find((tokenList) =>
            isTokenListEqual(tokenList, tokens.slice(i, i + tokenList.length))
        )

        if (!existingAcceptedToken) {
            acceptedTokenLists.push([token])
        }

        if (!expectTokenList) {
            i++
            expectTokenList = generateNextTokenList()
            continue
        }

        if (!isMatching && otherAcceptedTokenListMatch !== undefined) {
            if (!wrongTokenListsEncountered.has(otherAcceptedTokenListMatch)) {
                wrongTokenListsEncountered.add(otherAcceptedTokenListMatch)
            }

            // @todo: is this the right logic? If we expect "b c" but the text contains "a b c" while "a b c" being another accepted token list
            // then we'll match it before "b c" and skip "b c" altogether.
            i += otherAcceptedTokenListMatch.length

            continue
        }

        if (isMatching) {
            prng = createPrng({
                seed: `${opts.bind}${opts.plaintext.slice(
                    0,
                    token.indices.start
                )}`,
            })

            sequence.push({
                expect: expectTokenList,
                got: tokens.slice(i, i + expectTokenList.length),
            })
            outSkipMap.push('-')

            i += expectTokenList.length
            expectTokenList = generateNextTokenList()
            const strengthMul =
                acceptedTokenLists.length /
                (wrongTokenListsEncountered.size + 1)

            strength *= strengthMul
            trust += wrongTokenListsEncountered.size / acceptedTokenLists.length
            wrongTokenListsEncountered.clear()

            continue
        }

        i++
    }

    console.debug(`@sequencer`, {
        sequence,
        strength,
        _trust: trust,
        trust: 1 - trust / sequence.length,
        expect: expectTokenList,
        acceptedTokenLists,
        outSkipMap,
    })

    return {
        sequence,
        strength,
        trust: sequence.length > 0 ? 1 - trust / sequence.length : 0,
        expect: expectTokenList,
        acceptedTokenLists,
        state: prng.getState().toString(16),
        outSkipMap,
    }
}
