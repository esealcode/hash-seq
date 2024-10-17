import { useFormContext } from 'react-hook-form'

import { TConfigurationFormData } from '../_domain/types.editor.model'

export const useConfigurationForm = () => {
    return useFormContext<TConfigurationFormData>()
}
