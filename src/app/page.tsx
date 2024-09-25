'use client'
import { memo, useState, useEffect } from 'react'

import { Editor } from '@/context.editor/components'

export default function Home() {
    return (
        <div className="flex flex-col p-8">
            <Editor />
        </div>
    )
}
