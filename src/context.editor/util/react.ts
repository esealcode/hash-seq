import { memo, createContext, useContext, ForwardedRef, Context } from 'react'

export const genericMemo: <T>(component: T) => T = memo
export const manualForwardRef = <T>(ref: ForwardedRef<T>, value: T) => {
    if (ref === null) {
        return
    }

    if (typeof ref === 'function') {
        ref(value)
        return
    }

    ref.current = value
}
