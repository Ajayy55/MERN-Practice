import * as Yup from 'yup';

export const LoginSchema = Yup.object({
    email: Yup.string()
        .email('Please enter valid email')
        .required('Please enter email')
        .max(50, 'Must have less than 50 characters'),
        
        password: Yup.string()
        .min(6, 'Must have at least 6 characters ')
        .required('Please enter a password')
        .max(40, 'Must have less than 40 characters'),
})