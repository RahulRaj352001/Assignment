export interface Category {
  id: string;
  name: string;
  type: "income" | "expense"; // Determines whether this category applies to incomes or expenses
}

export interface CreateCategoryInput {
  name: string;
  type: "income" | "expense";
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: string;
}
