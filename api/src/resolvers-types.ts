import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { CategoryRecord } from './db/records/category';
import { CurrencyRecord } from './db/records/currency';
import { TransactionRecord } from './db/records/transaction';
import { AccountMailboxRecord } from './db/records/accountMailbox';
import { DailyExchangeRateRecord } from './db/records/dailyExchangeRate';
import { ExchangeRateValueRecord } from './db/records/exchangeRateValue';
import { FindTransactionsResult } from './db/queries/transaction/filterTransactions';
import { DailyTransactionsResult } from './resolvers/transactions';
import { MonthBudgetResult, CategoryBudgetGroupResult, CategoryBudgetResult } from './resolvers/budgets';
import { MoneyOptions } from './resolvers/money';
import { UserRecord } from './db/records/user';
import { UserCredentialRecord } from './db/records/userCredential';
import { Context } from './context';
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
  CurrencyCode: any;
  Date: any;
  DateTime: Date;
  JSON: any;
  UtcOffset: any;
};

export type AccountMailbox = {
  __typename?: 'AccountMailbox';
  amountPattern: Maybe<Scalars['String']>;
  datePattern: Maybe<Scalars['String']>;
  fromAddressPattern: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mailServerOptions: Scalars['JSON'];
  memoPattern: Maybe<Scalars['String']>;
  name: Scalars['String'];
  transactions: Array<Transaction>;
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
  currencyId: InputMaybe<Scalars['String']>;
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

export type CreateAccountMailboxInput = {
  amountPattern: InputMaybe<Scalars['String']>;
  datePattern: InputMaybe<Scalars['String']>;
  fromAddressPattern: InputMaybe<Scalars['String']>;
  mailServerOptions: Scalars['JSON'];
  memoPattern: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateCategoryInput = {
  budget: InputMaybe<Scalars['Int']>;
  budgetCurrencyId: InputMaybe<Scalars['String']>;
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
  categoryId: InputMaybe<Scalars['String']>;
  currencyId: Scalars['String'];
  date: InputMaybe<Scalars['Date']>;
  includeInReports: InputMaybe<Scalars['Boolean']>;
  memo: Scalars['String'];
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['CurrencyCode'];
  decimalDigits: Scalars['Int'];
  exchangeRate: Maybe<Scalars['Float']>;
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
  date: Maybe<Scalars['Date']>;
  totalSpent: Money;
  transactions: Array<Transaction>;
};


export type DailyTransactionsTotalSpentArgs = {
  currencyId: InputMaybe<Scalars['String']>;
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
  id: Scalars['String'];
  splits: Array<SplitTransactionItem>;
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
  nextOffset: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  accountMailbox: Maybe<AccountMailbox>;
  accountMailboxes: Array<AccountMailbox>;
  budget: MonthBudget;
  categories: Array<Category>;
  category: Maybe<Category>;
  currencies: Array<Currency>;
  currency: Maybe<Currency>;
  currentExchangeRates: Array<DailyExchangeRate>;
  currentUser: Maybe<CurrentUser>;
  transaction: Maybe<Transaction>;
  transactions: PaginatedTransactions;
  transactionsByDay: Array<DailyTransactions>;
};


export type QueryAccountMailboxArgs = {
  id: Scalars['String'];
};


export type QueryBudgetArgs = {
  currencyId: InputMaybe<Scalars['String']>;
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
  accountMailbox: AccountMailbox;
  accountMailboxId: Scalars['String'];
  amount: Money;
  category: Maybe<Category>;
  categoryId: Maybe<Scalars['String']>;
  currency: Currency;
  currencyId: Scalars['String'];
  date: Scalars['Date'];
  id: Scalars['String'];
  includeInReports: Scalars['Boolean'];
  memo: Scalars['String'];
  originalMemo: Scalars['String'];
  splitFrom: Maybe<Transaction>;
  splitFromId: Maybe<Scalars['String']>;
  splitTo: Array<Transaction>;
};


export type TransactionAmountArgs = {
  currencyId: InputMaybe<Scalars['String']>;
};

export type TransactionFilter = {
  categoryIds: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateFrom: InputMaybe<Scalars['Date']>;
  dateUntil: InputMaybe<Scalars['Date']>;
  keyword: InputMaybe<Scalars['String']>;
  maxAmount: InputMaybe<Scalars['Int']>;
  minAmount: InputMaybe<Scalars['Int']>;
};

export type UpdateAccountMailboxInput = {
  amountPattern: InputMaybe<Scalars['String']>;
  datePattern: InputMaybe<Scalars['String']>;
  fromAddressPattern: InputMaybe<Scalars['String']>;
  mailServerOptions: InputMaybe<Scalars['JSON']>;
  memoPattern: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  budget: InputMaybe<Scalars['Int']>;
  budgetCurrencyId: InputMaybe<Scalars['String']>;
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
  accountMailboxId: InputMaybe<Scalars['String']>;
  amount: InputMaybe<Scalars['Int']>;
  categoryId: InputMaybe<Scalars['String']>;
  currencyId: InputMaybe<Scalars['String']>;
  date: InputMaybe<Scalars['Date']>;
  includeInReports: InputMaybe<Scalars['Boolean']>;
  memo: InputMaybe<Scalars['String']>;
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
  AccountMailbox: ResolverTypeWrapper<AccountMailboxRecord>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<CategoryRecord>;
  CategoryBudget: ResolverTypeWrapper<CategoryBudgetResult>;
  CategoryBudgetGroup: ResolverTypeWrapper<CategoryBudgetGroupResult>;
  CreateAccountMailboxInput: CreateAccountMailboxInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCurrencyInput: CreateCurrencyInput;
  CreateTransactionInput: CreateTransactionInput;
  Currency: ResolverTypeWrapper<CurrencyRecord>;
  CurrencyCode: ResolverTypeWrapper<Scalars['CurrencyCode']>;
  CurrentUser: ResolverTypeWrapper<UserRecord>;
  DailyExchangeRate: ResolverTypeWrapper<DailyExchangeRateRecord>;
  DailyTransactions: ResolverTypeWrapper<DailyTransactionsResult>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  ExchangeRateValue: ResolverTypeWrapper<ExchangeRateValueRecord>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Money: ResolverTypeWrapper<MoneyOptions>;
  MonthBudget: ResolverTypeWrapper<MonthBudgetResult>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedTransactions: ResolverTypeWrapper<FindTransactionsResult>;
  Query: ResolverTypeWrapper<{}>;
  SplitTransactionItem: SplitTransactionItem;
  String: ResolverTypeWrapper<Scalars['String']>;
  Transaction: ResolverTypeWrapper<TransactionRecord>;
  TransactionFilter: TransactionFilter;
  UpdateAccountMailboxInput: UpdateAccountMailboxInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCurrencyInput: UpdateCurrencyInput;
  UpdateTransactionInput: UpdateTransactionInput;
  UserCredential: ResolverTypeWrapper<UserCredentialRecord>;
  UtcOffset: ResolverTypeWrapper<Scalars['UtcOffset']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountMailbox: AccountMailboxRecord;
  Boolean: Scalars['Boolean'];
  Category: CategoryRecord;
  CategoryBudget: CategoryBudgetResult;
  CategoryBudgetGroup: CategoryBudgetGroupResult;
  CreateAccountMailboxInput: CreateAccountMailboxInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCurrencyInput: CreateCurrencyInput;
  CreateTransactionInput: CreateTransactionInput;
  Currency: CurrencyRecord;
  CurrencyCode: Scalars['CurrencyCode'];
  CurrentUser: UserRecord;
  DailyExchangeRate: DailyExchangeRateRecord;
  DailyTransactions: DailyTransactionsResult;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  ExchangeRateValue: ExchangeRateValueRecord;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Money: MoneyOptions;
  MonthBudget: MonthBudgetResult;
  Mutation: {};
  PaginatedTransactions: FindTransactionsResult;
  Query: {};
  SplitTransactionItem: SplitTransactionItem;
  String: Scalars['String'];
  Transaction: TransactionRecord;
  TransactionFilter: TransactionFilter;
  UpdateAccountMailboxInput: UpdateAccountMailboxInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCurrencyInput: UpdateCurrencyInput;
  UpdateTransactionInput: UpdateTransactionInput;
  UserCredential: UserCredentialRecord;
  UtcOffset: Scalars['UtcOffset'];
};

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = Context, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountMailboxResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AccountMailbox'] = ResolversParentTypes['AccountMailbox']> = {
  amountPattern: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  datePattern: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromAddressPattern: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mailServerOptions: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  memoPattern: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactions: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
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
  exchangeRate: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType, RequireFields<CurrencyExchangeRateArgs, 'toId'>>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CurrencyCodeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CurrencyCode'], any> {
  name: 'CurrencyCode';
}

export type CurrentUserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CurrentUser'] = ResolversParentTypes['CurrentUser']> = {
  email: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registeredCredentials: Resolver<Array<ResolversTypes['UserCredential']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DailyExchangeRateResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DailyExchangeRate'] = ResolversParentTypes['DailyExchangeRate']> = {
  date: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  fromCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  fromCurrencyId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rates: Resolver<Array<ResolversTypes['ExchangeRateValue']>, ParentType, ContextType>;
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

export type ExchangeRateValueResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExchangeRateValue'] = ResolversParentTypes['ExchangeRateValue']> = {
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rate: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  toCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  toCurrencyId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  changePassword: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationCreateAccountMailboxArgs, 'input'>>;
  createCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType, RequireFields<MutationCreateCurrencyArgs, 'input'>>;
  createTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationCreateTransactionArgs, 'input'>>;
  deleteAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationDeleteAccountMailboxArgs, 'id'>>;
  deleteCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCredential: Resolver<ResolversTypes['UserCredential'], ParentType, ContextType, RequireFields<MutationDeleteCredentialArgs, 'id'>>;
  deleteCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType, RequireFields<MutationDeleteCurrencyArgs, 'id'>>;
  deleteTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationDeleteTransactionArgs, 'id'>>;
  generateCredentialLoginOptions: Resolver<ResolversTypes['JSON'], ParentType, ContextType, RequireFields<MutationGenerateCredentialLoginOptionsArgs, 'userId'>>;
  generateNewToken: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  login: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password' | 'turnstileToken'>>;
  loginViaCredential: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginViaCredentialArgs, 'response'>>;
  registerCredential: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  reorderCategories: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationReorderCategoriesArgs, 'orderedIds'>>;
  splitTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationSplitTransactionArgs, 'id' | 'splits'>>;
  updateAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationUpdateAccountMailboxArgs, 'id' | 'input'>>;
  updateCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'input'>>;
  updateCurrency: Resolver<ResolversTypes['Currency'], ParentType, ContextType, RequireFields<MutationUpdateCurrencyArgs, 'id' | 'input'>>;
  updateTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationUpdateTransactionArgs, 'id' | 'input'>>;
  verifyCredentialRegistration: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationVerifyCredentialRegistrationArgs, 'device' | 'response'>>;
};

export type PaginatedTransactionsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PaginatedTransactions'] = ResolversParentTypes['PaginatedTransactions']> = {
  data: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  nextOffset: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  accountMailbox: Resolver<Maybe<ResolversTypes['AccountMailbox']>, ParentType, ContextType, RequireFields<QueryAccountMailboxArgs, 'id'>>;
  accountMailboxes: Resolver<Array<ResolversTypes['AccountMailbox']>, ParentType, ContextType>;
  budget: Resolver<ResolversTypes['MonthBudget'], ParentType, ContextType, RequireFields<QueryBudgetArgs, 'month' | 'timezoneOffset' | 'year'>>;
  categories: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  currencies: Resolver<Array<ResolversTypes['Currency']>, ParentType, ContextType>;
  currency: Resolver<Maybe<ResolversTypes['Currency']>, ParentType, ContextType, RequireFields<QueryCurrencyArgs, 'id'>>;
  currentExchangeRates: Resolver<Array<ResolversTypes['DailyExchangeRate']>, ParentType, ContextType>;
  currentUser: Resolver<Maybe<ResolversTypes['CurrentUser']>, ParentType, ContextType>;
  transaction: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QueryTransactionArgs, 'id'>>;
  transactions: Resolver<ResolversTypes['PaginatedTransactions'], ParentType, ContextType, RequireFields<QueryTransactionsArgs, 'limit'>>;
  transactionsByDay: Resolver<Array<ResolversTypes['DailyTransactions']>, ParentType, ContextType, RequireFields<QueryTransactionsByDayArgs, 'dateFrom' | 'dateUntil'>>;
};

export type TransactionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  accountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType>;
  accountMailboxId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount: Resolver<ResolversTypes['Money'], ParentType, ContextType, Partial<TransactionAmountArgs>>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currency: Resolver<ResolversTypes['Currency'], ParentType, ContextType>;
  currencyId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  includeInReports: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  memo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalMemo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  AccountMailbox: AccountMailboxResolvers<ContextType>;
  Category: CategoryResolvers<ContextType>;
  CategoryBudget: CategoryBudgetResolvers<ContextType>;
  CategoryBudgetGroup: CategoryBudgetGroupResolvers<ContextType>;
  Currency: CurrencyResolvers<ContextType>;
  CurrencyCode: GraphQLScalarType;
  CurrentUser: CurrentUserResolvers<ContextType>;
  DailyExchangeRate: DailyExchangeRateResolvers<ContextType>;
  DailyTransactions: DailyTransactionsResolvers<ContextType>;
  Date: GraphQLScalarType;
  DateTime: GraphQLScalarType;
  ExchangeRateValue: ExchangeRateValueResolvers<ContextType>;
  JSON: GraphQLScalarType;
  Money: MoneyResolvers<ContextType>;
  MonthBudget: MonthBudgetResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PaginatedTransactions: PaginatedTransactionsResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Transaction: TransactionResolvers<ContextType>;
  UserCredential: UserCredentialResolvers<ContextType>;
  UtcOffset: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = Context> = {
  authenticated: AuthenticatedDirectiveResolver<any, any, ContextType>;
};
