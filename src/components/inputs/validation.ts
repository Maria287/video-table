export interface ValidationParams {
    inputs: {
        value: string | number | number[] | undefined;
        required: boolean;
        fieldName: string;
    }[];
}

export function validate(params: ValidationParams): { [fieldName: string]: string } | undefined {
    const errors: { [key: string]: string } = {};

    for (const input of params.inputs) {
        if (!input.required) {
            return undefined;
        }

        if (input.value === undefined || (Array.isArray(input.value) && input.value.length === 0)) {
            errors[input.fieldName] = `Value for field ${input.fieldName} is required`
        }
    }

    return Object.keys(errors).length === 0 ? undefined : errors;
}
