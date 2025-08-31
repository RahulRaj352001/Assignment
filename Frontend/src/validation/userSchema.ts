import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .nullable(),
  role: yup
    .string()
    .oneOf(["admin", "user", "read-only"], "Please select a valid role")
    .required("Role is required"),
});

export type UserFormData = yup.InferType<typeof userSchema>;

export const createUserSchema = userSchema.shape({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
export type CreateUserData = yup.InferType<typeof createUserSchema>;

export const updateUserSchema = userSchema;
export type UpdateUserData = yup.InferType<typeof updateUserSchema>;

export const updateUserRoleSchema = yup.object().shape({
  role: yup
    .string()
    .oneOf(["admin", "user", "read-only"], "Please select a valid role")
    .required("Role is required"),
});
export type UpdateUserRoleData = yup.InferType<typeof updateUserRoleSchema>;
