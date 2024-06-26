import { Schema } from 'express-validator';

export const SignupSchema: Schema = {
  email: {
    isEmail: true,
    notEmpty: true,
    optional: false,
  },
  password: {
    notEmpty: true,
    isLength: {
      options: { min: 8 },
    },
    optional: false,
  },
  role: {
    isString: true,
    notEmpty: true,
    isIn: {
      options: [['customer', 'provider']],
      errorMessage: 'not valid role: customer or provider',
    },
    exists: true,
    optional: false,
  },
  phone: {
    isMobilePhone: {
      options: ['any', { strictMode: true }],
    },
    optional: false,
  },
  firstName: {
    isString: true,
    notEmpty: true,
    optional: false,
  },
  lastName: {
    isString: true,
    notEmpty: true,
    optional: false,
  },
};

export const SigninSchema: Schema = {
  email: {
    isEmail: true,
    notEmpty: true,
    optional: false,
  },
  password: {
    notEmpty: true,
    optional: false,
    // TODO: uncomment rules complexity for other environments 
    // isStrongPassword: { options: { minUppercase: 1, minSymbols: 1, minNumbers: 1, minLength: 8 } }
  },
};
