'use client'

import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useConfigurationForm } from '@/context.trait/hooks/useConfigurationForm'
import {
    formDataToTraitsJson,
    traitsJsonToFormPatch,
} from '@/context.trait/util/configExportImport'

export function ConfigurationImportExport() {
    const form = useConfigurationForm()
    const fileRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)

    const exportJson = () => {
        setError(null)
        const doc = formDataToTraitsJson(form.getValues())
        const blob = new Blob([JSON.stringify(doc, null, 2)], {
            type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'traits-config.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) {
            return
        }
        setError(null)
        try {
            const text = await file.text()
            let json: unknown
            try {
                json = JSON.parse(text)
            } catch {
                throw new Error('File is not valid JSON')
            }
            const patch = traitsJsonToFormPatch(json)
            form.reset({
                binding: patch.binding,
                setCards: patch.setCards,
                entityDescription: patch.entityDescription,
                traits: {},
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Import failed')
        }
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <div className="flex flex-wrap justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={exportJson}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => fileRef.current?.click()}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    className="sr-only"
                    aria-hidden
                    onChange={onFile}
                />
            </div>
            {error ? (
                <p
                    role="alert"
                    className="max-w-full text-right text-xs text-destructive"
                >
                    {error}
                </p>
            ) : null}
        </div>
    )
}
