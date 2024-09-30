import * as R from 'ramda'

import { createPrng } from './prng'
import { tokenizeText, isTokenListEqual, TToken } from './parse'

type TSequenceTokenMatch = {
    expect: TToken[]
    got: TToken[]
}

type TOptionVariants =
    | {
          type: 'with-dict'
          words: string[]
      }
    | {
          type: 'self-inferring'
      }

type TOptions = {
    bind: string
    plaintext: string
    strict?: boolean
} & TOptionVariants

export const sequencer = (opts: TOptions) => {
    let prng = createPrng({ seed: opts.bind })

    let acceptedTokenLists: TToken[][] =
        opts.type === 'with-dict'
            ? opts.words.map((text) => tokenizeText({ text }))
            : []

    const tokens = tokenizeText({ text: opts.plaintext })

    const generateNextTokenList = () =>
        acceptedTokenLists.length > 0
            ? acceptedTokenLists[
                  Number(prng.random(0, acceptedTokenLists.length - 1))
              ]
            : []

    const sequence: TSequenceTokenMatch[] = []

    let expectTokenList = generateNextTokenList()
    let i = 0
    let strength = 1
    let trust = 1
    let wrongTokenListsEncountered: Set<TToken[]> = new Set()

    while (i < tokens.length) {
        const token = tokens[i]

        if (opts.type === 'self-inferring') {
            const existingAcceptedToken = acceptedTokenLists.find((tokenList) =>
                isTokenListEqual(
                    tokenList,
                    tokens.slice(i, i + tokenList.length)
                )
            )

            if (!existingAcceptedToken) {
                acceptedTokenLists.push([token])
            }

            if (!existingAcceptedToken && acceptedTokenLists.length === 20) {
                expectTokenList = generateNextTokenList()
                i++
                continue
            }

            if (acceptedTokenLists.length < 20) {
                i++
                continue
            }
        }

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

        if (
            expectTokenList.length > 0 &&
            !isMatching &&
            otherAcceptedTokenListMatch !== undefined
        ) {
            // Failure at...
            if (!wrongTokenListsEncountered.has(otherAcceptedTokenListMatch)) {
                wrongTokenListsEncountered.add(otherAcceptedTokenListMatch)
            }

            // @todo: is this the right logic? If we expect "b c" but the text contains "a b c" while "a b c" being another accepted token list
            // then we'll match it before "b c" and skip "b c" altogether.
            i += otherAcceptedTokenListMatch.length

            continue
        }

        if (isMatching) {
            if (opts.strict) {
                prng = createPrng({
                    seed: `${opts.bind}${opts.plaintext.slice(
                        0,
                        token.indices.start
                    )}`,
                })
            }

            sequence.push({
                expect: expectTokenList,
                got: tokens.slice(i, i + expectTokenList.length),
            })

            i += expectTokenList.length
            expectTokenList = generateNextTokenList()
            const strengthMul =
                acceptedTokenLists.length /
                (wrongTokenListsEncountered.size + 1)

            console.debug(`@sequencer mul strength`, {
                strength,
                strengthMul,
                wrong: Array.from(wrongTokenListsEncountered),
                acceptedTokenLists,
            })
            strength *= strengthMul
            trust +=
                (wrongTokenListsEncountered.size + 1) /
                acceptedTokenLists.length
            wrongTokenListsEncountered.clear()

            continue
        }

        i++
    }

    console.debug(`@sequencer`, {
        sequence,
        strength,
        trust: 1 - trust / sequence.length,
        expect: expectTokenList,
        acceptedTokenLists,
    })

    return {
        sequence,
        strength,
        trust: 1 - trust / sequence.length,
        expect: expectTokenList,
    }
}
