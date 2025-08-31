import * as yup from "yup";

export const transactionSchema = yup.object().shape({
  user_id: yup.string().required("User is required"),
  category_id: yup.number().required("Category is required").positive("Category must be selected"),
  type: yup.string().oneOf(["income", "expense"], "Type must be income or expense").required("Type is required"),
  amount: yup.number().positive("Amount must be positive").required("Amount is required"),
  description: yup.string().min(3, "Description must be at least 3 characters").max(255, "Description must be less than 255 characters").required("Description is required"),
  transaction_date: yup.string().required("Date is required"),
});

export type TransactionFormData = yup.InferType<typeof transactionSchema>;

export const updateTransactionSchema = yup.object().shape({
  category_id: yup.number().positive("Category must be selected"),
  type: yup.string().oneOf(["income", "expense"], "Type must be income or expense"),
  amount: yup.number().positive("Amount must be positive"),
  description: yup.string().min(3, "Description must be at least 3 characters").max(255, "Description must be less than 255 characters"),
  transaction_date: yup.string(),
});

export type UpdateTransactionFormData = yup.InferType<typeof updateTransactionSchema>;
