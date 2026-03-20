'use client'

// @warn: updating this file causes a fast-refresh that fails to refresh the files that imports from the Object.assign export in index.tsx
// This cause them to use an outdated reference to the slots thus failing reference checks and hiding slot content.

import { Button } from '@/components/ui/button'
import {
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { createSlot } from '@/components/ui/slot'

export const slots = {
    Trigger: createSlot(SheetTrigger),
    Title: createSlot(SheetTitle),
    Description: createSlot(SheetDescription),
    SubmitButton: createSlot(Button),
}
