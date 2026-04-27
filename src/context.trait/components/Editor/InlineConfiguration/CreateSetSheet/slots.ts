'use client'

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
