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
  CurrencyCode: any;
  Date: any;
  DateTime: any;
  JSON: any;
  UtcOffset: any;
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
  budget?: Maybe<Money>;
  budgetCurrency?: Maybe<Currency>;
  color: Scalars['String'];
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};


export type CategoryBudgetArgs = {
  currencyId?: InputMaybe<Scalars['String']>;
};

export type CategoryBudget = {
  __typename?: 'CategoryBudget';
  amountSpent: Money;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type CategoryBudgetGroup = {
  __typename?: 'CategoryBudgetGroup';
  categories: Array<CategoryBudget>;
  totalSpending: Money;
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
  budgetCurrencyId?: InputMaybe<Scalars['String']>;
  color: Scalars['String'];
  icon: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
};

export type CreateCurrencyInput = {
  code: Scalars['CurrencyCode'];
  decimalDigits: Scalars['Int'];
  symbol: Scalars['String'];
};

export type CreateTransactionInput = {
  accountMailboxId: Scalars['String'];
  amount: Scalars['Int'];
  categoryId?: InputMaybe<Scalars['String']>;
  currencyId: Scalars['String'];
  date?: InputMaybe<Scalars['Date']>;
  includeInReports?: InputMaybe<Scalars['Boolean']>;
  memo: Scalars['String'];
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['CurrencyCode'];
  decimalDigits: Scalars['Int'];
  exchangeRate?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  symbol: Scalars['String'];
};


export type CurrencyExchangeRateArgs = {
  toId: Scalars['String'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  email: Scalars['String'];
  id: Scalars['String'];
  registeredCredentials: Array<UserCredential>;
};

export type DailyExchangeRate = {
  __typename?: 'DailyExchangeRate';
  date: Scalars['Date'];
  fromCurrency: Currency;
  fromCurrencyId: Scalars['String'];
  id: Scalars['String'];
  rates: Array<ExchangeRateValue>;
};

export type DailyTransactions = {
  __typename?: 'DailyTransactions';
  date?: Maybe<Scalars['Date']>;
  totalSpent: Money;
  transactions: Array<Transaction>;
};


export type DailyTransactionsTotalSpentArgs = {
  currencyId?: InputMaybe<Scalars['String']>;
};

export type ExchangeRateValue = {
  __typename?: 'ExchangeRateValue';
  id: Scalars['String'];
  rate: Scalars['Float'];
  toCurrency: Currency;
  toCurrencyId: Scalars['String'];
};

export type Money = {
  __typename?: 'Money';
  decimalAmount: Scalars['Float'];
  formatted: Scalars['String'];
  formattedShort: Scalars['String'];
  integerAmount: Scalars['Int'];
};

export type MonthBudget = {
  __typename?: 'MonthBudget';
  difference: Money;
  id: Scalars['String'];
  income: Money;
  irregularCategories: CategoryBudgetGroup;
  month: Scalars['Int'];
  regularCategories: CategoryBudgetGroup;
  totalSpending: Money;
  year: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean'];
  createAccountMailbox: AccountMailbox;
  createCategory: Category;
  createCurrency: Currency;
  createTransaction: Transaction;
  deleteAccountMailbox: AccountMailbox;
  deleteCategory: Category;
  deleteCredential: UserCredential;
  deleteCurrency: Currency;
  deleteTransaction: Transaction;
  generateCredentialLoginOptions: Scalars['JSON'];
  generateNewToken: Scalars['String'];
  login: Scalars['String'];
  loginViaCredential: Scalars['String'];
  registerCredential: Scalars['JSON'];
  reorderCategories: Array<Category>;
  splitTransaction: Transaction;
  updateAccountMailbox: AccountMailbox;
  updateCategory: Category;
  updateCurrency: Currency;
  updateTransaction: Transaction;
  verifyCredentialRegistration: Scalars['Boolean'];
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


export type MutationCreateCurrencyArgs = {
  input: CreateCurrencyInput;
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


export type MutationDeleteCredentialArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCurrencyArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String'];
};


export type MutationGenerateCredentialLoginOptionsArgs = {
  userId: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  turnstileToken: Scalars['String'];
};


export type MutationLoginViaCredentialArgs = {
  response: Scalars['JSON'];
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


export type MutationUpdateCurrencyArgs = {
  id: Scalars['String'];
  input: UpdateCurrencyInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['String'];
  input: UpdateTransactionInput;
};


export type MutationVerifyCredentialRegistrationArgs = {
  device: Scalars['String'];
  response: Scalars['JSON'];
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
  budget: MonthBudget;
  categories: Array<Category>;
  category?: Maybe<Category>;
  currencies: Array<Currency>;
  currency?: Maybe<Currency>;
  currentExchangeRates: Array<DailyExchangeRate>;
  currentUser?: Maybe<CurrentUser>;
  transaction?: Maybe<Transaction>;
  transactions: PaginatedTransactions;
  transactionsByDay: Array<DailyTransactions>;
};


export type QueryAccountMailboxArgs = {
  id: Scalars['String'];
};


export type QueryBudgetArgs = {
  currencyId?: InputMaybe<Scalars['String']>;
  month: Scalars['Int'];
  timezoneOffset?: InputMaybe<Scalars['UtcOffset']>;
  year: Scalars['Int'];
};


export type QueryCategoryArgs = {
  id: Scalars['String'];
};


export type QueryCurrencyArgs = {
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


export type QueryTransactionsByDayArgs = {
  dateFrom: Scalars['Date'];
  dateUntil: Scalars['Date'];
};

export type Transaction = {
  __typename?: 'Transaction';
  accountMailbox: AccountMailbox;
  accountMailboxId: Scalars['String'];
  amount: Money;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']>;
  currency: Currency;
  currencyId: Scalars['String'];
  date: Scalars['Date'];
  id: Scalars['String'];
  includeInReports: Scalars['Boolean'];
  memo: Scalars['String'];
  originalMemo: Scalars['String'];
  splitFrom?: Maybe<Transaction>;
  splitFromId?: Maybe<Scalars['String']>;
  splitTo: Array<Transaction>;
};


export type TransactionAmountArgs = {
  currencyId?: InputMaybe<Scalars['String']>;
};

export type TransactionFilter = {
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateFrom?: InputMaybe<Scalars['Date']>;
  dateUntil?: InputMaybe<Scalars['Date']>;
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
  budgetCurrencyId?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  isRegular?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrencyInput = {
  decimalDigits: Scalars['Int'];
  symbol: Scalars['String'];
};

export type UpdateTransactionInput = {
  accountMailboxId?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['String']>;
  currencyId?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['Date']>;
  includeInReports?: InputMaybe<Scalars['Boolean']>;
  memo?: InputMaybe<Scalars['String']>;
};

export type UserCredential = {
  __typename?: 'UserCredential';
  createdAt: Scalars['Date'];
  device: Scalars['String'];
  id: Scalars['String'];
};

export type FullAccountMailboxFragment = { __typename?: 'AccountMailbox', id: string, name: string, mailServerOptions: any, fromAddressPattern?: string | null, datePattern?: string | null, memoPattern?: string | null, amountPattern?: string | null };

export type FullCategoryFragment = { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null };

export type FullCurrencyFragment = { __typename?: 'Currency', id: string, code: any, symbol: string, decimalDigits: number };

export type FullCurrentUserFragment = { __typename?: 'CurrentUser', id: string, email: string, registeredCredentials: Array<{ __typename?: 'UserCredential', id: string, device: string, createdAt: any }> };

export type FullTransactionFragment = { __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, includeInReports: boolean, currencyId: string, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> };

export type CreateAccountMailboxMutationVariables = Exact<{
  input: CreateAccountMailboxInput;
}>;


export type CreateAccountMailboxMutation = { __typename?: 'Mutation', createAccountMailbox: { __typename?: 'AccountMailbox', id: string } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string } };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };

export type DeleteAccountMailboxMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteAccountMailboxMutation = { __typename?: 'Mutation', deleteAccountMailbox: { __typename?: 'AccountMailbox', id: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', id: string } };

export type DeleteCredentialMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCredentialMutation = { __typename?: 'Mutation', deleteCredential: { __typename?: 'UserCredential', id: string } };

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: { __typename?: 'Transaction', id: string } };

export type GenerateCredentialLoginOptionsMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GenerateCredentialLoginOptionsMutation = { __typename?: 'Mutation', generateCredentialLoginOptions: any };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  turnstileToken: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LoginViaCredentialMutationVariables = Exact<{
  response: Scalars['JSON'];
}>;


export type LoginViaCredentialMutation = { __typename?: 'Mutation', loginViaCredential: string };

export type RegisterCredentialMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterCredentialMutation = { __typename?: 'Mutation', registerCredential: any };

export type ReorderCategoriesMutationVariables = Exact<{
  orderedIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type ReorderCategoriesMutation = { __typename?: 'Mutation', reorderCategories: Array<{ __typename?: 'Category', id: string }> };

export type SplitTransactionMutationVariables = Exact<{
  id: Scalars['String'];
  amounts: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type SplitTransactionMutation = { __typename?: 'Mutation', splitTransaction: { __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, includeInReports: boolean, currencyId: string, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> } };

export type UpdateAccountMailboxMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateAccountMailboxInput;
}>;


export type UpdateAccountMailboxMutation = { __typename?: 'Mutation', updateAccountMailbox: { __typename?: 'AccountMailbox', id: string, name: string, mailServerOptions: any, fromAddressPattern?: string | null, datePattern?: string | null, memoPattern?: string | null, amountPattern?: string | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null } };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['String'];
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', id: string } };

export type VerifyCredentialRegistrationMutationVariables = Exact<{
  response: Scalars['JSON'];
  device: Scalars['String'];
}>;


export type VerifyCredentialRegistrationMutation = { __typename?: 'Mutation', verifyCredentialRegistration: boolean };

export type AccountMailboxesQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountMailboxesQuery = { __typename?: 'Query', accountMailboxes: Array<{ __typename?: 'AccountMailbox', id: string, name: string, mailServerOptions: any, fromAddressPattern?: string | null, datePattern?: string | null, memoPattern?: string | null, amountPattern?: string | null }> };

export type BudgetQueryVariables = Exact<{
  currencyId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
  month: Scalars['Int'];
}>;


export type BudgetQuery = { __typename?: 'Query', budget: { __typename?: 'MonthBudget', id: string, month: number, income: { __typename?: 'Money', decimalAmount: number, formatted: string }, totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, difference: { __typename?: 'Money', decimalAmount: number, formatted: string }, regularCategories: { __typename?: 'CategoryBudgetGroup', totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, categories: Array<{ __typename?: 'CategoryBudget', id: string, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, budget?: { __typename?: 'Money', decimalAmount: number, formatted: string } | null } | null, amountSpent: { __typename?: 'Money', decimalAmount: number, formatted: string } }> }, irregularCategories: { __typename?: 'CategoryBudgetGroup', totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, categories: Array<{ __typename?: 'CategoryBudget', id: string, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, budget?: { __typename?: 'Money', decimalAmount: number, formatted: string } | null } | null, amountSpent: { __typename?: 'Money', decimalAmount: number, formatted: string } }> } } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null }> };

export type CurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrenciesQuery = { __typename?: 'Query', currencies: Array<{ __typename?: 'Currency', id: string, code: any, symbol: string, decimalDigits: number }> };

export type CurrentExchangeRatesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentExchangeRatesQuery = { __typename?: 'Query', currentExchangeRates: Array<{ __typename?: 'DailyExchangeRate', date: any, fromCurrency: { __typename?: 'Currency', code: any }, rates: Array<{ __typename?: 'ExchangeRateValue', rate: number, toCurrency: { __typename?: 'Currency', code: any } }> }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'CurrentUser', id: string, email: string, registeredCredentials: Array<{ __typename?: 'UserCredential', id: string, device: string, createdAt: any }> } | null };

export type GetAccountMailboxQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetAccountMailboxQuery = { __typename?: 'Query', accountMailbox?: { __typename?: 'AccountMailbox', id: string, name: string, mailServerOptions: any, fromAddressPattern?: string | null, datePattern?: string | null, memoPattern?: string | null, amountPattern?: string | null } | null };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null } | null };

export type GetCurrencyQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetCurrencyQuery = { __typename?: 'Query', currency?: { __typename?: 'Currency', id: string, code: any, symbol: string, decimalDigits: number } | null };

export type GetTransactionQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetTransactionQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, includeInReports: boolean, currencyId: string, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> } | null };

export type TransactionsByDayQueryVariables = Exact<{
  currencyId?: InputMaybe<Scalars['String']>;
  dateFrom: Scalars['Date'];
  dateUntil: Scalars['Date'];
}>;


export type TransactionsByDayQuery = { __typename?: 'Query', transactionsByDay: Array<{ __typename?: 'DailyTransactions', date?: any | null, totalSpent: { __typename?: 'Money', formattedShort: string }, transactions: Array<{ __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, includeInReports: boolean, currencyId: string, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> }> }> };

export type TransactionsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<TransactionFilter>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'PaginatedTransactions', nextOffset?: string | null, data: Array<{ __typename?: 'Transaction', id: string, memo: string, date: any, originalMemo: string, includeInReports: boolean, currencyId: string, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, accountMailbox: { __typename?: 'AccountMailbox', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> }> } };
