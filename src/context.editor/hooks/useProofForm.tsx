import { useFormContext } from 'react-hook-form'

import { TProofFormData } from '../_domain/types.editor'

export const useProofForm = () => {
    return useFormContext<TProofFormData>()
}
