// 

import * as Yup from 'yup';

export const SignUpSchema = Yup.object({
    username: Yup.string()
        .min(4, 'Must have more than 4 characters')
        .max(25, 'Must have less than 25 characters')
        .required('Please enter username'),
        
    email: Yup.string()
        .email('Please enter valid email')
        .required('Please enter email')
        .max(50, 'Must have less than 50 characters'),
        
    gender: Yup.string()
        .required('Please choose your gender'),
        
    mobile: Yup.string()
        .required('Please enter mobile number')
        .matches(/^\d{10}$/, 'Mobile number should be 10 digits only '), // Add regex for mobile format if needed
        
    password: Yup.string()
        .min(6, 'Must have at least 6 characters ')
        .required('Please enter a password')
        .max(40, 'Must have less than 40 characters'),
        
    password1: Yup.string()
        .min(6, 'Must have at least 6 characters')
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Confirm password not match'), // Fixed the position of null
});
