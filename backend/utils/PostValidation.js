import { body, param } from "express-validator";

export const createPostValidation = [
  body("title")
    .exists()
    .withMessage("title is required")
    .isString()
    .notEmpty()
    .withMessage("title must be a string")
    .trim()
    .blacklist("$\\{}<>")
    .withMessage("title must not contain special characters"),

  body("Content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .notEmpty()
    .trim()
    .withMessage("Content must be a string")
    .blacklist("$\\{}<>"),
];

export const getPostValidation = [
  param("id")
    .exists()
    .withMessage("id is required")
    .isInt()
    .notEmpty()
    .withMessage("id must be a string")
    .trim(),
];
