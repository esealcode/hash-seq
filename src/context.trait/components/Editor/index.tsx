'use client'

import React, { memo } from 'react'

import { InlineConfigurationFields } from './InlineConfiguration'

export const ConfigurationEditor = memo((props) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-auto p-8">
            <InlineConfigurationFields />
        </div>
    )
})

ConfigurationEditor.displayName = 'ConfigurationEditor'
