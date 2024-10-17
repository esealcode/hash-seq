'use client'
import { memo, useState, useEffect } from 'react'

import { ConfigurationEditor } from '@/context.trait/components/Editor'

export default function Traits() {
    return (
        <div className="flex flex-col p-8">
            <ConfigurationEditor />
        </div>
    )
}
