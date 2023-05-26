import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { CategoryRecord } from './db/records/category';
import { Currency as CurrencyValue, Money as MoneyValue } from 'ts-money';
import { TransactionRecord } from './db/records/transaction';
import { AccountRecord } from './db/records/account';
import { FindTransactionsResult } from './db/queries/transaction/filterTransactions';
import { DailyTransactionsResult } from './resolvers/transactions';
import { MonthBudgetResult, CategoryBudgetGroupResult, CategoryBudgetResult } from './resolvers/budgets';
import { AnnualBalanceResult, MonthBalanceResult } from './resolvers/balance';
import { UserRecord } from './db/records/user';
import { UserCredentialRecord } from './db/records/userCredential';
import { Context, AuthenticatedContext } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  CurrencyCode: string;
  Date: Date;
  DateTime: Date;
  JSON: any;
  PastDate: any;
  UtcOffset: string;
};

export type Account = {
  __typename?: 'Account';
  currency: Currency;
  currencyCode: Scalars['CurrencyCode'];
  id: Scalars['String'];
  name: Scalars['String'];
  transactions: Array<Transaction>;
};

export type AnnualBalance = {
  __typename?: 'AnnualBalance';
  currency: Currency;
  difference: Money;
  id: Scalars['String'];
  income: Money;
  months: Array<MonthBalance>;
  totalSpending: Money;
  year: Scalars['Int'];
};

export type Category = {
  __typename?: 'Category';
  budget: Maybe<Money>;
  budgetCurrency: Maybe<Currency>;
  color: Scalars['String'];
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
  sortOrder: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};


export type CategoryBudgetArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
  date: InputMaybe<Scalars['Date']>;
};

export type CategoryBudget = {
  __typename?: 'CategoryBudget';
  amountSpent: Money;
  category: Maybe<Category>;
  categoryId: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type CategoryBudgetGroup = {
  __typename?: 'CategoryBudgetGroup';
  categories: Array<CategoryBudget>;
  totalSpending: Money;
};

export type CreateAccountInput = {
  currencyCode: Scalars['CurrencyCode'];
  name: Scalars['String'];
};

export type CreateCategoryInput = {
  budget: InputMaybe<Scalars['Int']>;
  budgetCurrencyCode: InputMaybe<Scalars['String']>;
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
  accountId: Scalars['String'];
  amount: Scalars['Int'];
  categoryId: InputMaybe<Scalars['String']>;
  currencyCode: Scalars['CurrencyCode'];
  date: Scalars['PastDate'];
  includeInReports: InputMaybe<Scalars['Boolean']>;
  memo: Scalars['String'];
  originalAmount: InputMaybe<Scalars['Int']>;
  originalCurrencyCode: InputMaybe<Scalars['CurrencyCode']>;
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['CurrencyCode'];
  decimalDigits: Scalars['Int'];
  exchangeRate: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
};


export type CurrencyExchangeRateArgs = {
  toCode: Scalars['String'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  defaultAccount: Maybe<Account>;
  defaultAccountId: Maybe<Scalars['String']>;
  defaultCurrency: Currency;
  email: Scalars['String'];
  favoriteCurrencies: Array<Currency>;
  id: Scalars['String'];
  registeredCredentials: Array<UserCredential>;
};

export type DailyTransactions = {
  __typename?: 'DailyTransactions';
  date: Maybe<Scalars['Date']>;
  totalSpent: Money;
  transactions: Array<Transaction>;
};


export type DailyTransactionsTotalSpentArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
};

export type Money = {
  __typename?: 'Money';
  decimalAmount: Scalars['Float'];
  formatted: Scalars['String'];
  formattedShort: Scalars['String'];
  integerAmount: Scalars['Int'];
};

export type MonthBalance = {
  __typename?: 'MonthBalance';
  difference: Money;
  id: Scalars['String'];
  income: Money;
  month: Scalars['Int'];
  totalSpending: Money;
  year: Scalars['Int'];
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
  createAccount: Account;
  createCategory: Category;
  createTransaction: Transaction;
  deleteAccount: Account;
  deleteCategory: Category;
  deleteCredential: UserCredential;
  deleteTransaction: Transaction;
  favoriteCurrency: CurrentUser;
  generateCredentialLoginOptions: Scalars['JSON'];
  generateNewToken: Scalars['String'];
  login: Scalars['String'];
  loginViaCredential: Scalars['String'];
  registerCredential: Scalars['JSON'];
  reorderCategories: Array<Category>;
  setDefaultAccount: CurrentUser;
  setDefaultCurrency: CurrentUser;
  splitTransaction: Transaction;
  unfavoriteCurrency: CurrentUser;
  updateAccount: Account;
  updateCategory: Category;
  updateTransaction: Transaction;
  verifyCredentialRegistration: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
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
  id: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String'];
};


export type MutationDeleteCredentialArgs = {
  id: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String'];
};


export type MutationFavoriteCurrencyArgs = {
  code: Scalars['CurrencyCode'];
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


export type MutationSetDefaultAccountArgs = {
  id: Scalars['String'];
};


export type MutationSetDefaultCurrencyArgs = {
  code: Scalars['CurrencyCode'];
};


export type MutationSplitTransactionArgs = {
  id: Scalars['String'];
  splits: Array<SplitTransactionItem>;
};


export type MutationUnfavoriteCurrencyArgs = {
  code: Scalars['CurrencyCode'];
};


export type MutationUpdateAccountArgs = {
  id: Scalars['String'];
  input: UpdateAccountInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['String'];
  input: UpdateCategoryInput;
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
  nextOffset: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  account: Maybe<Account>;
  accounts: Array<Account>;
  balance: AnnualBalance;
  budget: MonthBudget;
  categories: Array<Category>;
  category: Maybe<Category>;
  currencies: Array<Currency>;
  currency: Maybe<Currency>;
  currentUser: Maybe<CurrentUser>;
  transaction: Maybe<Transaction>;
  transactions: PaginatedTransactions;
  transactionsByDay: Array<DailyTransactions>;
};


export type QueryAccountArgs = {
  id: Scalars['String'];
};


export type QueryBalanceArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
  year: Scalars['Int'];
};


export type QueryBudgetArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
  month: Scalars['Int'];
  timezoneOffset?: InputMaybe<Scalars['UtcOffset']>;
  year: Scalars['Int'];
};


export type QueryCategoryArgs = {
  id: Scalars['String'];
};


export type QueryCurrencyArgs = {
  code: Scalars['String'];
};


export type QueryTransactionArgs = {
  id: Scalars['String'];
};


export type QueryTransactionsArgs = {
  filter: InputMaybe<TransactionFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['String']>;
};


export type QueryTransactionsByDayArgs = {
  dateFrom: Scalars['Date'];
  dateUntil: Scalars['Date'];
};

export type SplitTransactionItem = {
  amount: Scalars['Int'];
  memo: InputMaybe<Scalars['String']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  account: Account;
  accountId: Scalars['String'];
  amount: Money;
  category: Maybe<Category>;
  categoryId: Maybe<Scalars['String']>;
  currency: Currency;
  currencyCode: Scalars['CurrencyCode'];
  date: Scalars['Date'];
  id: Scalars['String'];
  includeInReports: Scalars['Boolean'];
  memo: Scalars['String'];
  originalAmount: Maybe<Money>;
  originalCurrency: Maybe<Currency>;
  originalCurrencyCode: Maybe<Scalars['CurrencyCode']>;
  splitFrom: Maybe<Transaction>;
  splitFromId: Maybe<Scalars['String']>;
  splitTo: Array<Transaction>;
};


export type TransactionAmountArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
};


export type TransactionOriginalAmountArgs = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
};

export type TransactionFilter = {
  categoryIds: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateFrom: InputMaybe<Scalars['Date']>;
  dateUntil: InputMaybe<Scalars['Date']>;
  keyword: InputMaybe<Scalars['String']>;
  maxAmount: InputMaybe<Scalars['Int']>;
  minAmount: InputMaybe<Scalars['Int']>;
};

export type UpdateAccountInput = {
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
  name: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  budget: InputMaybe<Scalars['Int']>;
  budgetCurrencyCode: InputMaybe<Scalars['String']>;
  color: InputMaybe<Scalars['String']>;
  icon: InputMaybe<Scalars['String']>;
  isRegular: InputMaybe<Scalars['Boolean']>;
  name: InputMaybe<Scalars['String']>;
};

export type UpdateCurrencyInput = {
  decimalDigits: Scalars['Int'];
  symbol: Scalars['String'];
};

export type UpdateTransactionInput = {
  accountId: InputMaybe<Scalars['String']>;
  amount: InputMaybe<Scalars['Int']>;
  categoryId: InputMaybe<Scalars['String']>;
  currencyCode: InputMaybe<Scalars['CurrencyCode']>;
  date: InputMaybe<Scalars['PastDate']>;
  includeInReports: InputMaybe<Scalars['Boolean']>;
  memo: InputMaybe<Scalars['String']>;
  originalAmount: InputMaybe<Scalars['Int']>;
  originalCurrencyCode: InputMaybe<Scalars['CurrencyCode']>;
};

export type UserCredential = {
  __typename?: 'UserCredential';
  createdAt: Scalars['Date'];
  device: Scalars['String'];
  id: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Account: ResolverTypeWrapper<AccountRecord>;
  AnnualBalance: ResolverTypeWrapper<AnnualBalanceResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<CategoryRecord>;
  CategoryBudget: ResolverTypeWrapper<CategoryBudgetResult>;
  CategoryBudgetGroup: ResolverTypeWrapper<CategoryBudgetGroupResult>;
  CreateAccountInput: CreateAccountInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCurrencyInput: CreateCurrencyInput;
  CreateTransactionInput: CreateTransactionInput;
  Currency: ResolverTypeWrapper<CurrencyValue>;
  CurrencyCode: ResolverTypeWrapper<Scalars['CurrencyCode']>;
  CurrentUser: ResolverTypeWrapper<UserRecord>;
  DailyTransactions: ResolverTypeWrapper<DailyTransactionsResult>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Money: ResolverTypeWrapper<MoneyValue>;
  MonthBalance: ResolverTypeWrapper<MonthBalanceResult>;
  MonthBudget: ResolverTypeWrapper<MonthBudgetResult>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedTransactions: ResolverTypeWrapper<FindTransactionsResult>;
  PastDate: ResolverTypeWrapper<Scalars['PastDate']>;
  Query: ResolverTypeWrapper<{}>;
  SplitTransactionItem: SplitTransactionItem;
  String: ResolverTypeWrapper<Scalars['String']>;
  Transaction: ResolverTypeWrapper<TransactionRecord>;
  TransactionFilter: TransactionFilter;
  UpdateAccountInput: UpdateAccountInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCurrencyInput: UpdateCurrencyInput;
  UpdateTransactionInput: UpdateTransactionInput;
  UserCredential: ResolverTypeWrapper<UserCredentialRecord>;
  UtcOffset: ResolverTypeWrapper<Scalars['UtcOffset']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Account: AccountRecord;
  AnnualBalance: AnnualBalanceResult;
  Boolean: Scalars['Boolean'];
  Category: CategoryRecord;
  CategoryBudget: CategoryBudgetResult;
  CategoryBudgetGroup: CategoryBudgetGroupResult;
  CreateAccountInput: CreateAccountInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCurrencyInput: CreateCurrencyInput;
  CreateTransactionInput: CreateTransactionInput;
  Currency: CurrencyValue;
  CurrencyCode: Scalars['CurrencyCode'];
  CurrentUser: UserRecord;
  DailyTransactions: DailyTransactionsResult;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Money: MoneyValue;
  MonthBalance: MonthBalanceResult;
  MonthBudget: MonthBudgetResult;
  Mutation: {};
  PaginatedTransactions: FindTransactionsResult;
  PastDate: Scalars['PastDate'];
  Query: {};
  SplitTransactionItem: SplitTransactionItem;
  String: Scalars['String'];
  Transaction: TransactionRecord;
  TransactionFilter: TransactionFilter;
  UpdateAccountInput: UpdateAccountInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCurrencyInput: UpdateCurrencyInput;
  UpdateTransactionInput: UpdateTransactionInput;
  UserCredential: UserCredentialRecord;
  UtcOffset: Scalars['UtcOffset'];
};

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = {
  currency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  currencyCode: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactions: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnnualBalanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AnnualBalance'] = ResolversParentTypes['AnnualBalance']> = {
  currency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  difference: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  income: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  months: Resolver<Array<ResolversTypes['MonthBalance']>, ParentType, ContextType>;
  totalSpending: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  budget: Resolver<Maybe<ResolversTypes['Money']>, ParentType, ContextType, Partial<CategoryBudgetArgs>>;
  budgetCurrency: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  color: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  icon: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRegular: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sortOrder: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryBudgetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CategoryBudget'] = ResolversParentTypes['CategoryBudget']> = {
  amountSpent: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryBudgetGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CategoryBudgetGroup'] = ResolversParentTypes['CategoryBudgetGroup']> = {
  categories: Resolver<Array<ResolversTypes['CategoryBudget']>, ParentType, ContextType>;
  totalSpending: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrencyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Currency'] = ResolversParentTypes['Currency']> = {
  code: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  decimalDigits: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  exchangeRate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType, RequireFields<CurrencyExchangeRateArgs, 'toCode'>>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CurrencyCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CurrencyCode'], any> {
  name: 'CurrencyCode';
}

export type CurrentUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CurrentUser'] = ResolversParentTypes['CurrentUser']> = {
  defaultAccount: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  defaultAccountId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  defaultCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favoriteCurrencies: Resolver<Array<ResolversTypes['Currency']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registeredCredentials: Resolver<Array<ResolversTypes['UserCredential']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailyTransactionsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DailyTransactions'] = ResolversParentTypes['DailyTransactions']> = {
  date: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  totalSpent: Resolver<ResolversTypes['Money'], ParentType, ContextType, Partial<DailyTransactionsTotalSpentArgs>>;
  transactions: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MoneyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Money'] = ResolversParentTypes['Money']> = {
  decimalAmount: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  formatted: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  formattedShort: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  integerAmount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MonthBalanceResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthBalance'] = ResolversParentTypes['MonthBalance']> = {
  difference: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  income: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  month: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalSpending: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MonthBudgetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthBudget'] = ResolversParentTypes['MonthBudget']> = {
  difference: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  income: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  irregularCategories: Resolver<ResolversTypes['CategoryBudgetGroup'], ParentType, ContextType>;
  month: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  regularCategories: Resolver<ResolversTypes['CategoryBudgetGroup'], ParentType, ContextType>;
  totalSpending: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword: Resolver<ResolversTypes['Boolean'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createAccount: Resolver<ResolversTypes['Account'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationCreateAccountArgs, 'input'>>;
  createCategory: Resolver<ResolversTypes['Category'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createTransaction: Resolver<ResolversTypes['Transaction'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationCreateTransactionArgs, 'input'>>;
  deleteAccount: Resolver<ResolversTypes['Account'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationDeleteAccountArgs, 'id'>>;
  deleteCategory: Resolver<ResolversTypes['Category'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCredential: Resolver<ResolversTypes['UserCredential'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationDeleteCredentialArgs, 'id'>>;
  deleteTransaction: Resolver<ResolversTypes['Transaction'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationDeleteTransactionArgs, 'id'>>;
  favoriteCurrency: Resolver<ResolversTypes['CurrentUser'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationFavoriteCurrencyArgs, 'code'>>;
  generateCredentialLoginOptions: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationGenerateCredentialLoginOptionsArgs, 'userId'>>;
  generateNewToken: Resolver<ResolversTypes['String'], ParentType, AuthenticatedContext<ContextType>>;
  login: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password' | 'turnstileToken'>>;
  loginViaCredential: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginViaCredentialArgs, 'response'>>;
  registerCredential: Resolver<ResolversTypes['JSON'], ParentType, AuthenticatedContext<ContextType>>;
  reorderCategories: Resolver<Array<ResolversTypes['Category']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationReorderCategoriesArgs, 'orderedIds'>>;
  setDefaultAccount: Resolver<ResolversTypes['CurrentUser'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationSetDefaultAccountArgs, 'id'>>;
  setDefaultCurrency: Resolver<ResolversTypes['CurrentUser'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationSetDefaultCurrencyArgs, 'code'>>;
  splitTransaction: Resolver<ResolversTypes['Transaction'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationSplitTransactionArgs, 'id' | 'splits'>>;
  unfavoriteCurrency: Resolver<ResolversTypes['CurrentUser'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationUnfavoriteCurrencyArgs, 'code'>>;
  updateAccount: Resolver<ResolversTypes['Account'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationUpdateAccountArgs, 'id' | 'input'>>;
  updateCategory: Resolver<ResolversTypes['Category'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationUpdateCategoryArgs, 'id' | 'input'>>;
  updateTransaction: Resolver<ResolversTypes['Transaction'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationUpdateTransactionArgs, 'id' | 'input'>>;
  verifyCredentialRegistration: Resolver<ResolversTypes['Boolean'], ParentType, AuthenticatedContext<ContextType>, RequireFields<MutationVerifyCredentialRegistrationArgs, 'device' | 'response'>>;
};

export type PaginatedTransactionsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PaginatedTransactions'] = ResolversParentTypes['PaginatedTransactions']> = {
  data: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  nextOffset: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface PastDateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['PastDate'], any> {
  name: 'PastDate';
}

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account: Resolver<Maybe<ResolversTypes['Account']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryAccountArgs, 'id'>>;
  accounts: Resolver<Array<ResolversTypes['Account']>, ParentType, AuthenticatedContext<ContextType>>;
  balance: Resolver<ResolversTypes['AnnualBalance'], ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryBalanceArgs, 'year'>>;
  budget: Resolver<ResolversTypes['MonthBudget'], ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryBudgetArgs, 'month' | 'timezoneOffset' | 'year'>>;
  categories: Resolver<Array<ResolversTypes['Category']>, ParentType, AuthenticatedContext<ContextType>>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryCategoryArgs, 'id'>>;
  currencies: Resolver<Array<ResolversTypes['Currency']>, ParentType, AuthenticatedContext<ContextType>>;
  currency: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryCurrencyArgs, 'code'>>;
  currentUser: Resolver<Maybe<ResolversTypes['CurrentUser']>, ParentType, ContextType>;
  transaction: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryTransactionArgs, 'id'>>;
  transactions: Resolver<ResolversTypes['PaginatedTransactions'], ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryTransactionsArgs, 'limit'>>;
  transactionsByDay: Resolver<Array<ResolversTypes['DailyTransactions']>, ParentType, AuthenticatedContext<ContextType>, RequireFields<QueryTransactionsByDayArgs, 'dateFrom' | 'dateUntil'>>;
};

export type TransactionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  account: Resolver<ResolversTypes['Account'], ParentType, ContextType>;
  accountId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount: Resolver<ResolversTypes['Money'], ParentType, ContextType, Partial<TransactionAmountArgs>>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  currencyCode: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  date: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  includeInReports: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  memo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalAmount: Resolver<Maybe<ResolversTypes['Money']>, ParentType, ContextType, Partial<TransactionOriginalAmountArgs>>;
  originalCurrency: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType>;
  originalCurrencyCode: Resolver<Maybe<ResolversTypes['CurrencyCode']>, ParentType, ContextType>;
  splitFrom: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
  splitFromId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  splitTo: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserCredentialResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserCredential'] = ResolversParentTypes['UserCredential']> = {
  createdAt: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  device: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UtcOffsetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UtcOffset'], any> {
  name: 'UtcOffset';
}

export type Resolvers<ContextType = Context> = {
  Account: AccountResolvers<ContextType>;
  AnnualBalance: AnnualBalanceResolvers<ContextType>;
  Category: CategoryResolvers<ContextType>;
  CategoryBudget: CategoryBudgetResolvers<ContextType>;
  CategoryBudgetGroup: CategoryBudgetGroupResolvers<ContextType>;
  Currency: CurrencyResolvers<ContextType>;
  CurrencyCode: GraphQLScalarType;
  CurrentUser: CurrentUserResolvers<ContextType>;
  DailyTransactions: DailyTransactionsResolvers<ContextType>;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  JSON: GraphQLScalarType;
  Money: MoneyResolvers<ContextType>;
  MonthBalance: MonthBalanceResolvers<ContextType>;
  MonthBudget: MonthBudgetResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PaginatedTransactions: PaginatedTransactionsResolvers<ContextType>;
  PastDate: GraphQLScalarType;
  Query: QueryResolvers<ContextType>;
  Transaction: TransactionResolvers<ContextType>;
  UserCredential: UserCredentialResolvers<ContextType>;
  UtcOffset: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = Context> = {
  authenticated: AuthenticatedDirectiveResolver<any, any, ContextType>;
};
