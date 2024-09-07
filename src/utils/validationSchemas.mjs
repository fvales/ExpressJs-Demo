export const createUserValidationSchema = {
    name: {
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        },
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: 'Name must be at least 5 characters with max 32 characters'
        },
    }
}