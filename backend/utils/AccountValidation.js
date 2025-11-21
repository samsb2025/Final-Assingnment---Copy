import { body, param, validationResult } from "express-validator";

export const createAccountValidation = [
  body("username")
    .exists()
    .withMessage("username is required")
    .isString()
    .notEmpty()
    .withMessage("username must be a string")
    .trim()
    .blacklist(/^[a-zA-Z0-9_]+$/)
    .withMessage("username must not contain special characters"),

  body("email")
    .exists()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be a valid email address")
    .trim(),

  body("password")
    .exists()
    .withMessage("password is required")
    .isString()
    .notEmpty()
    .trim(),

  body("role")
    .exists()
    .withMessage("role is required")
    .isString()
    .notEmpty()
    .withMessage("role must be a string")
    .trim(),
  body("firstName")
    .exists()
    .withMessage("firstName is required")
    .isString()
    .notEmpty()
    .withMessage("firstName must be a string")
    .trim()
    .blacklist(/^[a-zA-Z0-9_]+$/)
    .withMessage("username must not contain special characters"),

  body("lastName")
    .exists()
    .withMessage("lastName is required")
    .isString()
    .notEmpty()
    .withMessage("lastName must be a string")
    .blacklist(/^[a-zA-Z0-9_]+$/)
    .withMessage("username must not contain special characters")
    .trim(),
];

export const getAccountValidation = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt()
    .notEmpty()
    .withMessage("id must be a string")
    .trim(),
];

