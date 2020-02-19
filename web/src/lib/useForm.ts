import { useState } from 'react';

interface useFormInterface {
    inputs: any;
    handleChange(e: any): void;
    resetForm(): void;
}

export default function useForm(initialState = {}): useFormInterface {
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


    return {
        inputs,
        handleChange,
        resetForm,
    };
}