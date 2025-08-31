import * as yup from "yup";

export const categorySchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be less than 50 characters")
    .required("Category name is required"),
  type: yup
    .string()
    .oneOf(["income", "expense"], "Type must be either income or expense")
    .required("Type is required"),
});

export type CategoryFormData = yup.InferType<typeof categorySchema>;

export const createCategorySchema = categorySchema;
export type CreateCategoryData = yup.InferType<typeof createCategorySchema>;

export const updateCategorySchema = categorySchema;
export type UpdateCategoryData = yup.InferType<typeof updateCategorySchema>;
