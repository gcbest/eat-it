import { useState } from 'react';
import { useFormInterface } from './interfaces';

export default function useForm(initialState: any = {}): useFormInterface {
    const [inputs, updateInputs] = useState(initialState);
    function handleChange(e: any) {
        if (e.target && e.target.hasAttribute('multiple') === true) {
            const selectedOptions: string[] = Array.from(e.target.selectedOptions).map((opt: any) => opt.value);
            updateInputs({
                ...inputs,
                [e.target.name]: [...selectedOptions].join(), // create a string of all selected numbers: e.g. 2,4
            });
        } else {
            updateInputs({
                ...inputs,
                [e.target.name]: isNaN(parseFloat(e.target.value)) ? e.target.value : parseFloat(e.target.value) // convert '1' to 1.0 but leave text alone
            })
        }
    }

    function resetForm() {
        updateInputs(initialState);
    }

    function forceChange(updates: any) {
        updateInputs({...inputs, ...updates})
    }

    function isRegistrationValid() {
        if (!confirmPasswordsMatch())
            return false;

        const required_fields = ['email', 'password', 'confirmPassword', 'exerciseLevel', 'diets'];
        const hasAll = required_fields.every(prop => inputs.hasOwnProperty(prop));

        if (!hasAll)
            return false;

        for (const key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                const value = inputs[key];
                if (value.length < 1)
                    return false;
            }
        }

        return true;
    }

    const isCreateRecipeValid = (): boolean => {
        const required_fields = ['title', 'summary'];
        const hasAll = required_fields.every(prop => inputs.hasOwnProperty(prop));

        if (!hasAll)
            return false;

        return true
    }

    const confirmPasswordsMatch = (): boolean => {
        const { password, confirmPassword } = inputs;
        if (!password || !confirmPassword)
            return true;

        if (password.length > 0 && confirmPassword.length > 0)
            return password === confirmPassword;
        else
            return true;
    }

    return {
        inputs,
        handleChange,
        forceChange,
        resetForm,
        isRegistrationValid,
        confirmPasswordsMatch,
        isCreateRecipeValid
    };
}