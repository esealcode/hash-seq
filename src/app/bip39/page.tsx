'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const WORD_SEGMENT = /[a-zA-Z]+|[^a-zA-Z]+/g

function segmentText(input: string): string[] {
    if (!input) return []
    return input.match(WORD_SEGMENT) ?? []
}

export default function Bip39WordCheckPage() {
    const [text, setText] = useState('')
    const [wordSet, setWordSet] = useState<Set<string> | null>(null)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const res = await fetch('/bip-0039.txt')
                if (!res.ok) throw new Error(`${res.status}`)
                const body = await res.text()
                if (cancelled) return
                const words = body
                    .split(/\r?\n/)
                    .map((w) => w.trim().toLowerCase())
                    .filter(Boolean)
                setWordSet(new Set(words))
                setLoadError(null)
            } catch {
                if (!cancelled) {
                    setLoadError('Could not load BIP-0039 wordlist.')
                    setWordSet(null)
                }
            }
        })()
        return () => {
            cancelled = true
        }
    }, [])

    const preview = useMemo(() => {
        if (!wordSet) return null
        const parts = segmentText(text)
        return parts.map((part, i) => {
            const isWord = /^[a-zA-Z]+$/.test(part)
            if (!isWord) {
                return (
                    <span key={i} className="text-foreground">
                        {part}
                    </span>
                )
            }
            const inList = wordSet.has(part.toLowerCase())
            return (
                <span
                    key={i}
                    className={cn(
                        inList ? 'text-destructive' : 'text-emerald-500'
                    )}
                >
                    {part}
                </span>
            )
        })
    }, [text, wordSet])

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setText(e.target.value)
        },
        []
    )

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-4 p-8">
            <div>
                <h1 className="font-serif text-2xl font-semibold tracking-tight">
                    BIP-39 word check
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Words that appear on the official list are shown in red;
                    everything else is green. Punctuation and spaces are
                    unchanged.
                </p>
            </div>

            <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Text</span>
                <Textarea
                    value={text}
                    onChange={onChange}
                    placeholder="Type or paste a phrase…"
                    className="min-h-[140px] font-mono text-sm"
                    spellCheck={false}
                />
            </label>

            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Check</span>
                <div
                    className={cn(
                        'min-h-[100px] rounded-md border border-border bg-input px-3 py-2 font-mono text-sm',
                        'whitespace-pre-wrap break-words'
                    )}
                    aria-live="polite"
                >
                    {loadError ? (
                        <span className="text-destructive">{loadError}</span>
                    ) : wordSet == null ? (
                        <span className="text-muted-foreground">
                            Loading wordlist…
                        </span>
                    ) : text.length === 0 ? (
                        <span className="text-muted-foreground">
                            Preview appears here as you type.
                        </span>
                    ) : (
                        preview
                    )}
                </div>
            </div>
        </div>
    )
}
