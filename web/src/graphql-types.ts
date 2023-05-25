export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  CurrencyCode: { input: any; output: any; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  UtcOffset: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  transactions: Array<Transaction>;
};

export type Category = {
  __typename?: 'Category';
  budget?: Maybe<Money>;
  budgetCurrency?: Maybe<Currency>;
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRegular: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  sortOrder?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryBudgetArgs = {
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
};

export type CategoryBudget = {
  __typename?: 'CategoryBudget';
  amountSpent: Money;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type CategoryBudgetGroup = {
  __typename?: 'CategoryBudgetGroup';
  categories: Array<CategoryBudget>;
  totalSpending: Money;
};

export type CreateAccountInput = {
  name: Scalars['String']['input'];
};

export type CreateCategoryInput = {
  budget?: InputMaybe<Scalars['Int']['input']>;
  budgetCurrencyCode?: InputMaybe<Scalars['String']['input']>;
  color: Scalars['String']['input'];
  icon: Scalars['String']['input'];
  isRegular: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type CreateCurrencyInput = {
  code: Scalars['CurrencyCode']['input'];
  decimalDigits: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
};

export type CreateTransactionInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Int']['input'];
  categoryId?: InputMaybe<Scalars['String']['input']>;
  currencyCode: Scalars['CurrencyCode']['input'];
  date?: InputMaybe<Scalars['Date']['input']>;
  includeInReports?: InputMaybe<Scalars['Boolean']['input']>;
  memo: Scalars['String']['input'];
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['CurrencyCode']['output'];
  decimalDigits: Scalars['Int']['output'];
  exchangeRate?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};


export type CurrencyExchangeRateArgs = {
  toCode: Scalars['String']['input'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  defaultAccount?: Maybe<Account>;
  defaultAccountId?: Maybe<Scalars['String']['output']>;
  defaultCurrency: Currency;
  email: Scalars['String']['output'];
  favoriteCurrencies: Array<Currency>;
  id: Scalars['String']['output'];
  registeredCredentials: Array<UserCredential>;
};

export type DailyTransactions = {
  __typename?: 'DailyTransactions';
  date?: Maybe<Scalars['Date']['output']>;
  totalSpent: Money;
  transactions: Array<Transaction>;
};


export type DailyTransactionsTotalSpentArgs = {
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
};

export type Money = {
  __typename?: 'Money';
  decimalAmount: Scalars['Float']['output'];
  formatted: Scalars['String']['output'];
  formattedShort: Scalars['String']['output'];
  integerAmount: Scalars['Int']['output'];
};

export type MonthBudget = {
  __typename?: 'MonthBudget';
  difference: Money;
  id: Scalars['String']['output'];
  income: Money;
  irregularCategories: CategoryBudgetGroup;
  month: Scalars['Int']['output'];
  regularCategories: CategoryBudgetGroup;
  totalSpending: Money;
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
  createAccount: Account;
  createCategory: Category;
  createTransaction: Transaction;
  deleteAccount: Account;
  deleteCategory: Category;
  deleteCredential: UserCredential;
  deleteTransaction: Transaction;
  favoriteCurrency: CurrentUser;
  generateCredentialLoginOptions: Scalars['JSON']['output'];
  generateNewToken: Scalars['String']['output'];
  login: Scalars['String']['output'];
  loginViaCredential: Scalars['String']['output'];
  registerCredential: Scalars['JSON']['output'];
  reorderCategories: Array<Category>;
  setDefaultAccount: CurrentUser;
  setDefaultCurrency: CurrentUser;
  splitTransaction: Transaction;
  unfavoriteCurrency: CurrentUser;
  updateAccount: Account;
  updateCategory: Category;
  updateTransaction: Transaction;
  verifyCredentialRegistration: Scalars['Boolean']['output'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCredentialArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String']['input'];
};


export type MutationFavoriteCurrencyArgs = {
  code: Scalars['CurrencyCode']['input'];
};


export type MutationGenerateCredentialLoginOptionsArgs = {
  userId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  turnstileToken: Scalars['String']['input'];
};


export type MutationLoginViaCredentialArgs = {
  response: Scalars['JSON']['input'];
};


export type MutationReorderCategoriesArgs = {
  orderedIds: Array<Scalars['String']['input']>;
};


export type MutationSetDefaultAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetDefaultCurrencyArgs = {
  code: Scalars['CurrencyCode']['input'];
};


export type MutationSplitTransactionArgs = {
  id: Scalars['String']['input'];
  splits: Array<SplitTransactionItem>;
};


export type MutationUnfavoriteCurrencyArgs = {
  code: Scalars['CurrencyCode']['input'];
};


export type MutationUpdateAccountArgs = {
  id: Scalars['String']['input'];
  input: UpdateAccountInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['String']['input'];
  input: UpdateTransactionInput;
};


export type MutationVerifyCredentialRegistrationArgs = {
  device: Scalars['String']['input'];
  response: Scalars['JSON']['input'];
};

export type PaginatedTransactions = {
  __typename?: 'PaginatedTransactions';
  data: Array<Transaction>;
  nextOffset?: Maybe<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<Account>;
  accounts: Array<Account>;
  budget: MonthBudget;
  categories: Array<Category>;
  category?: Maybe<Category>;
  currencies: Array<Currency>;
  currency?: Maybe<Currency>;
  currentUser?: Maybe<CurrentUser>;
  transaction?: Maybe<Transaction>;
  transactions: PaginatedTransactions;
  transactionsByDay: Array<DailyTransactions>;
};


export type QueryAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryBudgetArgs = {
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
  month: Scalars['Int']['input'];
  timezoneOffset?: InputMaybe<Scalars['UtcOffset']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryCurrencyArgs = {
  code: Scalars['String']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsArgs = {
  filter?: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTransactionsByDayArgs = {
  dateFrom: Scalars['Date']['input'];
  dateUntil: Scalars['Date']['input'];
};

export type SplitTransactionItem = {
  amount: Scalars['Int']['input'];
  memo?: InputMaybe<Scalars['String']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  account: Account;
  accountId: Scalars['String']['output'];
  amount: Money;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']['output']>;
  currency: Currency;
  currencyCode: Scalars['CurrencyCode']['output'];
  date: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  includeInReports: Scalars['Boolean']['output'];
  memo: Scalars['String']['output'];
  splitFrom?: Maybe<Transaction>;
  splitFromId?: Maybe<Scalars['String']['output']>;
  splitTo: Array<Transaction>;
};


export type TransactionAmountArgs = {
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
};

export type TransactionFilter = {
  categoryIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  dateFrom?: InputMaybe<Scalars['Date']['input']>;
  dateUntil?: InputMaybe<Scalars['Date']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  maxAmount?: InputMaybe<Scalars['Int']['input']>;
  minAmount?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateAccountInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  budget?: InputMaybe<Scalars['Int']['input']>;
  budgetCurrencyCode?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  isRegular?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCurrencyInput = {
  decimalDigits: Scalars['Int']['input'];
  symbol: Scalars['String']['input'];
};

export type UpdateTransactionInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  includeInReports?: InputMaybe<Scalars['Boolean']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
};

export type UserCredential = {
  __typename?: 'UserCredential';
  createdAt: Scalars['Date']['output'];
  device: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type FullAccountFragment = { __typename?: 'Account', id: string, name: string };

export type FullCategoryFragment = { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null };

export type FullCurrencyFragment = { __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number };

export type FullCurrentUserFragment = { __typename?: 'CurrentUser', id: string, email: string, defaultCurrency: { __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number }, favoriteCurrencies: Array<{ __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number }>, defaultAccount?: { __typename?: 'Account', id: string, name: string } | null, registeredCredentials: Array<{ __typename?: 'UserCredential', id: string, device: string, createdAt: any }> };

export type FullTransactionFragment = { __typename?: 'Transaction', id: string, memo: string, date: any, includeInReports: boolean, currencyCode: any, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, account: { __typename?: 'Account', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'Account', id: string } };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string } };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'Transaction', id: string } };

export type DeleteAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: { __typename?: 'Account', id: string } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'Category', id: string } };

export type DeleteCredentialMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteCredentialMutation = { __typename?: 'Mutation', deleteCredential: { __typename?: 'UserCredential', id: string } };

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: { __typename?: 'Transaction', id: string } };

export type FavoriteCurrencyMutationVariables = Exact<{
  code: Scalars['CurrencyCode']['input'];
}>;


export type FavoriteCurrencyMutation = { __typename?: 'Mutation', favoriteCurrency: { __typename?: 'CurrentUser', id: string } };

export type GenerateCredentialLoginOptionsMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GenerateCredentialLoginOptionsMutation = { __typename?: 'Mutation', generateCredentialLoginOptions: any };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  turnstileToken: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LoginViaCredentialMutationVariables = Exact<{
  response: Scalars['JSON']['input'];
}>;


export type LoginViaCredentialMutation = { __typename?: 'Mutation', loginViaCredential: string };

export type RegisterCredentialMutationVariables = Exact<{ [key: string]: never; }>;


export type RegisterCredentialMutation = { __typename?: 'Mutation', registerCredential: any };

export type ReorderCategoriesMutationVariables = Exact<{
  orderedIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ReorderCategoriesMutation = { __typename?: 'Mutation', reorderCategories: Array<{ __typename?: 'Category', id: string }> };

export type SetDefaultAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SetDefaultAccountMutation = { __typename?: 'Mutation', setDefaultAccount: { __typename?: 'CurrentUser', id: string } };

export type SetDefaultCurrencyMutationVariables = Exact<{
  code: Scalars['CurrencyCode']['input'];
}>;


export type SetDefaultCurrencyMutation = { __typename?: 'Mutation', setDefaultCurrency: { __typename?: 'CurrentUser', id: string } };

export type SplitTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  splits: Array<SplitTransactionItem> | SplitTransactionItem;
}>;


export type SplitTransactionMutation = { __typename?: 'Mutation', splitTransaction: { __typename?: 'Transaction', id: string, memo: string, date: any, includeInReports: boolean, currencyCode: any, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, account: { __typename?: 'Account', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> } };

export type UnfavoriteCurrencyMutationVariables = Exact<{
  code: Scalars['CurrencyCode']['input'];
}>;


export type UnfavoriteCurrencyMutation = { __typename?: 'Mutation', unfavoriteCurrency: { __typename?: 'CurrentUser', id: string } };

export type UpdateAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateAccountInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'Account', id: string, name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null } };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'Transaction', id: string } };

export type VerifyCredentialRegistrationMutationVariables = Exact<{
  response: Scalars['JSON']['input'];
  device: Scalars['String']['input'];
}>;


export type VerifyCredentialRegistrationMutation = { __typename?: 'Mutation', verifyCredentialRegistration: boolean };

export type AccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'Account', id: string, name: string }> };

export type BudgetQueryVariables = Exact<{
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
  year: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
}>;


export type BudgetQuery = { __typename?: 'Query', budget: { __typename?: 'MonthBudget', id: string, month: number, income: { __typename?: 'Money', decimalAmount: number, formatted: string }, totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, difference: { __typename?: 'Money', decimalAmount: number, formatted: string }, regularCategories: { __typename?: 'CategoryBudgetGroup', totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, categories: Array<{ __typename?: 'CategoryBudget', id: string, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, budget?: { __typename?: 'Money', decimalAmount: number, formatted: string } | null } | null, amountSpent: { __typename?: 'Money', decimalAmount: number, formatted: string } }> }, irregularCategories: { __typename?: 'CategoryBudgetGroup', totalSpending: { __typename?: 'Money', decimalAmount: number, formatted: string }, categories: Array<{ __typename?: 'CategoryBudget', id: string, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, budget?: { __typename?: 'Money', decimalAmount: number, formatted: string } | null } | null, amountSpent: { __typename?: 'Money', decimalAmount: number, formatted: string } }> } } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null }> };

export type CurrenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrenciesQuery = { __typename?: 'Query', currencies: Array<{ __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number }> };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'CurrentUser', id: string, email: string, defaultCurrency: { __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number }, favoriteCurrencies: Array<{ __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number }>, defaultAccount?: { __typename?: 'Account', id: string, name: string } | null, registeredCredentials: Array<{ __typename?: 'UserCredential', id: string, device: string, createdAt: any }> } | null };

export type GetAccountQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAccountQuery = { __typename?: 'Query', account?: { __typename?: 'Account', id: string, name: string } | null };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string, isRegular: boolean, sortOrder?: number | null, createdAt: any, updatedAt: any, budget?: { __typename?: 'Money', formatted: string } | null } | null };

export type GetCurrencyQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type GetCurrencyQuery = { __typename?: 'Query', currency?: { __typename?: 'Currency', code: any, name: string, symbol: string, decimalDigits: number } | null };

export type GetTransactionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetTransactionQuery = { __typename?: 'Query', transaction?: { __typename?: 'Transaction', id: string, memo: string, date: any, includeInReports: boolean, currencyCode: any, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, account: { __typename?: 'Account', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> } | null };

export type TransactionsByDayQueryVariables = Exact<{
  currencyCode?: InputMaybe<Scalars['CurrencyCode']['input']>;
  dateFrom: Scalars['Date']['input'];
  dateUntil: Scalars['Date']['input'];
}>;


export type TransactionsByDayQuery = { __typename?: 'Query', transactionsByDay: Array<{ __typename?: 'DailyTransactions', date?: any | null, totalSpent: { __typename?: 'Money', formattedShort: string }, transactions: Array<{ __typename?: 'Transaction', id: string, memo: string, date: any, includeInReports: boolean, currencyCode: any, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, account: { __typename?: 'Account', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> }> }> };

export type TransactionsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<TransactionFilter>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: { __typename?: 'PaginatedTransactions', nextOffset?: string | null, data: Array<{ __typename?: 'Transaction', id: string, memo: string, date: any, includeInReports: boolean, currencyCode: any, splitFromId?: string | null, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, color: string, icon: string } | null, account: { __typename?: 'Account', id: string, name: string }, splitTo: Array<{ __typename?: 'Transaction', id: string, memo: string, includeInReports: boolean, amount: { __typename?: 'Money', decimalAmount: number, formatted: string }, category?: { __typename?: 'Category', id: string, name: string, icon: string, color: string } | null }> }> } };
