import { useState } from 'react';

interface useFormInterface {
    inputs: any;
    handleChange(e: any): void;
    resetForm(): void;
    isValid(): boolean;
    confirmPasswordsMatch(): boolean;
}

export default function useForm(initialState: any = {}): useFormInterface {
    const [inputs, updateInputs] = useState(initialState);

    function handleChange(e: any) {
        if (e.target && e.target.hasAttribute('multiple') === true) {
            const selectedOptions: string[] = Array.from(e.target.selectedOptions).map((opt: any) => opt.value);
            updateInputs({
                ...inputs,
                [e.target.name]: [...selectedOptions],
            });
        } else {
            updateInputs({
                ...inputs,
                [e.target.name]: e.target.value
            })
        }
    }

    function resetForm() {
        updateInputs(initialState);
    }

    function isValid() {
        if (!confirmPasswordsMatch())
            return false;

        const required_fields = ['email', 'password', 'confirmPassword', 'diets'];
        const hasAll = required_fields.every(prop => inputs.hasOwnProperty(prop));

        if (!hasAll)
            return false;

        for (const key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                debugger;
                const value = inputs[key];
                if (value.length < 1)
                    return false;
            }
        }

        return true;
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
        resetForm,
        isValid,
        confirmPasswordsMatch
    };
}