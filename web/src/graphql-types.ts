export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
};

export type AccountMailbox = {
  __typename?: 'AccountMailbox';
  amountPattern?: Maybe<Scalars['String']>;
  datePattern?: Maybe<Scalars['String']>;
  fromAddressPattern?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mailServerOptions: Scalars['JSON'];
  memoPattern?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  transactions: Array<Transaction>;
};

export type Category = {
  __typename?: 'Category';
  budget?: Maybe<Scalars['Int']>;
  color: Scalars['String'];
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};

export type CategoryBudget = {
  __typename?: 'CategoryBudget';
  amountSpent: Scalars['Int'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type CreateAccountMailboxInput = {
  amountPattern?: InputMaybe<Scalars['String']>;
  datePattern?: InputMaybe<Scalars['String']>;
  fromAddressPattern?: InputMaybe<Scalars['String']>;
  mailServerOptions: Scalars['JSON'];
  memoPattern?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateCategoryInput = {
  budget?: InputMaybe<Scalars['Int']>;
  color: Scalars['String'];
  icon: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
};

export type CreateTransactionInput = {
  accountMailboxId: Scalars['String'];
  amount: Scalars['Int'];
  categoryId?: InputMaybe<Scalars['String']>;
  currency: Scalars['String'];
  date?: InputMaybe<Scalars['DateTime']>;
  includeInReports?: InputMaybe<Scalars['Boolean']>;
  memo: Scalars['String'];
};

export type MonthBudget = {
  __typename?: 'MonthBudget';
  categories: Array<CategoryBudget>;
  id: Scalars['String'];
  income: Scalars['Int'];
  month: Scalars['Int'];
  year: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  createAccountMailbox: AccountMailbox;
  createCategory: Category;
  createTransaction: Transaction;
  deleteAccountMailbox: AccountMailbox;
  deleteCategory: Category;
  deleteTransaction: Transaction;
  generateNewToken: Scalars['String'];
  login: Scalars['String'];
  reorderCategories: Array<Category>;
  splitTransaction: Transaction;
  updateAccountMailbox: AccountMailbox;
  updateCategory: Category;
  updateTransaction: Transaction;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateAccountMailboxArgs = {
  input: CreateAccountMailboxInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteAccountMailboxArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationReorderCategoriesArgs = {
  orderedIds: Array<Scalars['String']>;
};


export type MutationSplitTransactionArgs = {
  amounts: Array<Scalars['Int']>;
  id: Scalars['String'];
};


export type MutationUpdateAccountMailboxArgs = {
  id: Scalars['String'];
  input: UpdateAccountMailboxInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String'];
  input: UpdateCategoryInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['String'];
  input: UpdateTransactionInput;
};

export type PaginatedTransactions = {
  __typename?: 'PaginatedTransactions';
  data: Array<Transaction>;
  nextOffset?: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  accountMailbox?: Maybe<AccountMailbox>;
  accountMailboxes: Array<AccountMailbox>;
  budgets: Array<MonthBudget>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  transaction?: Maybe<Transaction>;
  transactions: PaginatedTransactions;
};


export type QueryAccountMailboxArgs = {
  id: Scalars['String'];
};


export type QueryBudgetsArgs = {
  year: Scalars['String'];
};


export type QueryCategoryArgs = {
  id: Scalars['String'];
};


export type QueryTransactionArgs = {
  id: Scalars['String'];
};


export type QueryTransactionsArgs = {
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  accountMailbox: AccountMailbox;
  accountMailboxId: Scalars['String'];
  amount: Scalars['Int'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']>;
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  id: Scalars['String'];
  includeInReports: Scalars['Boolean'];
  memo: Scalars['String'];
  originalMemo: Scalars['String'];
  splitFrom?: Maybe<Transaction>;
  splitFromId?: Maybe<Scalars['String']>;
  splitTo: Array<Transaction>;
};

export type TransactionFilter = {
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']>;
  dateUntil?: InputMaybe<Scalars['DateTime']>;
  keyword?: InputMaybe<Scalars['String']>;
};

export type UpdateAccountMailboxInput = {
  amountPattern?: InputMaybe<Scalars['String']>;
  datePattern?: InputMaybe<Scalars['String']>;
  fromAddressPattern?: InputMaybe<Scalars['String']>;
  mailServerOptions?: InputMaybe<Scalars['JSON']>;
  memoPattern?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  budget?: InputMaybe<Scalars['Int']>;
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  isRegular?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTransactionInput = {
  accountMailboxId?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  includeInReports?: InputMaybe<Scalars['Boolean']>;
  memo?: InputMaybe<Scalars['String']>;
};

export type DeleteAccountMailboxMutationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteAccountMailboxMutationMutation = { __typename?: 'Mutation', deleteAccountMailbox: { __typename?: 'AccountMailbox', id: string } };

export type FindAccountMailboxesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAccountMailboxesQuery = { __typename?: 'Query', accountMailboxes: Array<{ __typename?: 'AccountMailbox', id: string, name: string, mailServerOptions: any, fromAddressPattern?: string | null, datePattern?: string | null, memoPattern?: string | null, amountPattern?: string | null }> };

export type DeleteCategoryMutationMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCategoryMutationMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', id: string } };

export type ReorderCategoriesMutationMutationVariables = Exact<{
  orderedIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type ReorderCategoriesMutationMutation = { __typename?: 'Mutation', reorderCategories: Array<{ __typename?: 'Category', id: string, sortOrder?: number | null }> };

export type FindCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type FindCategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, color: string, icon: string, budget?: number | null, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any }> };

export type AccountMailboxOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountMailboxOptionsQuery = { __typename?: 'Query', accountMailboxes: Array<{ __typename?: 'AccountMailbox', id: string, name: string }> };

export type CategoryOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoryOptionsQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, color: string, icon: string }> };

export type FindTransactionsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TransactionFilter>;
}>;


export type FindTransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'PaginatedTransactions', nextOffset?: string | null, data: Array<{ __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, amount: number, includeInReports: boolean, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, amount: number, includeInReports: boolean, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> }> } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string } };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };
