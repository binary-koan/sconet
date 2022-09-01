import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { CategoryRecord } from './db/records/category';
import { TransactionRecord } from './db/records/transaction';
import { AccountMailboxRecord } from './db/records/accountMailbox';
import { FindTransactionsResult } from './db/queries/transaction/findTransactions';
import { MonthBudgetResult, CategoryBudgetResult } from './db/queries/budgets/budgetsInYear';
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
  DateTime: Date;
  JSON: any;
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
  budget: Maybe<Scalars['Int']>;
  color: Scalars['String'];
  createdAt: Scalars['DateTime'];
  icon: Scalars['String'];
  id: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
  sortOrder: Maybe<Scalars['Int']>;
  updatedAt: Scalars['DateTime'];
};

export type CategoryBudget = {
  __typename?: 'CategoryBudget';
  amountSpent: Scalars['Int'];
  category: Maybe<Category>;
  categoryId: Maybe<Scalars['String']>;
  id: Scalars['String'];
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
  color: Scalars['String'];
  icon: Scalars['String'];
  isRegular: Scalars['Boolean'];
  name: Scalars['String'];
};

export type CreateTransactionInput = {
  accountMailboxId: Scalars['String'];
  amount: Scalars['Int'];
  categoryId: InputMaybe<Scalars['String']>;
  date: InputMaybe<Scalars['DateTime']>;
  includeInReports: InputMaybe<Scalars['Boolean']>;
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
  nextOffset: Maybe<Scalars['String']>;
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  accountMailbox: Maybe<AccountMailbox>;
  accountMailboxes: Array<AccountMailbox>;
  budgets: Array<MonthBudget>;
  categories: Array<Category>;
  category: Maybe<Category>;
  transaction: Maybe<Transaction>;
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
  filter: InputMaybe<TransactionFilter>;
  limit: InputMaybe<Scalars['Int']>;
  offset: InputMaybe<Scalars['String']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  accountMailbox: AccountMailbox;
  accountMailboxId: Scalars['String'];
  amount: Scalars['Int'];
  category: Maybe<Category>;
  categoryId: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  id: Scalars['String'];
  includeInReports: Scalars['Boolean'];
  memo: Scalars['String'];
  originalMemo: Scalars['String'];
  splitFrom: Maybe<Transaction>;
  splitFromId: Maybe<Scalars['String']>;
  splitTo: Array<Transaction>;
};

export type TransactionFilter = {
  categoryIds: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateFrom: InputMaybe<Scalars['DateTime']>;
  dateUntil: InputMaybe<Scalars['DateTime']>;
  keyword: InputMaybe<Scalars['String']>;
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
  color: InputMaybe<Scalars['String']>;
  icon: InputMaybe<Scalars['String']>;
  isRegular: InputMaybe<Scalars['Boolean']>;
  name: InputMaybe<Scalars['String']>;
};

export type UpdateTransactionInput = {
  accountMailboxId: InputMaybe<Scalars['String']>;
  amount: InputMaybe<Scalars['Int']>;
  categoryId: InputMaybe<Scalars['String']>;
  date: InputMaybe<Scalars['DateTime']>;
  includeInReports: InputMaybe<Scalars['Boolean']>;
  memo: InputMaybe<Scalars['String']>;
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
  CreateAccountMailboxInput: CreateAccountMailboxInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateTransactionInput: CreateTransactionInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  MonthBudget: ResolverTypeWrapper<MonthBudgetResult>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginatedTransactions: ResolverTypeWrapper<FindTransactionsResult>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Transaction: ResolverTypeWrapper<TransactionRecord>;
  TransactionFilter: TransactionFilter;
  UpdateAccountMailboxInput: UpdateAccountMailboxInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateTransactionInput: UpdateTransactionInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountMailbox: AccountMailboxRecord;
  Boolean: Scalars['Boolean'];
  Category: CategoryRecord;
  CategoryBudget: CategoryBudgetResult;
  CreateAccountMailboxInput: CreateAccountMailboxInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateTransactionInput: CreateTransactionInput;
  DateTime: Scalars['DateTime'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  MonthBudget: MonthBudgetResult;
  Mutation: {};
  PaginatedTransactions: FindTransactionsResult;
  Query: {};
  String: Scalars['String'];
  Transaction: TransactionRecord;
  TransactionFilter: TransactionFilter;
  UpdateAccountMailboxInput: UpdateAccountMailboxInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateTransactionInput: UpdateTransactionInput;
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
  budget: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  amountSpent: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MonthBudgetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MonthBudget'] = ResolversParentTypes['MonthBudget']> = {
  categories: Resolver<Array<ResolversTypes['CategoryBudget']>, ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  income: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  month: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  year: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationCreateAccountMailboxArgs, 'input'>>;
  createCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationCreateTransactionArgs, 'input'>>;
  deleteAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationDeleteAccountMailboxArgs, 'id'>>;
  deleteCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationDeleteTransactionArgs, 'id'>>;
  generateNewToken: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  login: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  reorderCategories: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationReorderCategoriesArgs, 'orderedIds'>>;
  splitTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationSplitTransactionArgs, 'amounts' | 'id'>>;
  updateAccountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType, RequireFields<MutationUpdateAccountMailboxArgs, 'id' | 'input'>>;
  updateCategory: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'input'>>;
  updateTransaction: Resolver<ResolversTypes['Transaction'], ParentType, ContextType, RequireFields<MutationUpdateTransactionArgs, 'id' | 'input'>>;
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
  budgets: Resolver<Array<ResolversTypes['MonthBudget']>, ParentType, ContextType, RequireFields<QueryBudgetsArgs, 'year'>>;
  categories: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  transaction: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType, RequireFields<QueryTransactionArgs, 'id'>>;
  transactions: Resolver<ResolversTypes['PaginatedTransactions'], ParentType, ContextType, Partial<QueryTransactionsArgs>>;
};

export type TransactionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Transaction'] = ResolversParentTypes['Transaction']> = {
  accountMailbox: Resolver<ResolversTypes['AccountMailbox'], ParentType, ContextType>;
  accountMailboxId: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  category: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  includeInReports: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  memo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  originalMemo: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  splitFrom: Resolver<Maybe<ResolversTypes['Transaction']>, ParentType, ContextType>;
  splitFromId: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  splitTo: Resolver<Array<ResolversTypes['Transaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AccountMailbox: AccountMailboxResolvers<ContextType>;
  Category: CategoryResolvers<ContextType>;
  CategoryBudget: CategoryBudgetResolvers<ContextType>;
  DateTime: GraphQLScalarType;
  JSON: GraphQLScalarType;
  MonthBudget: MonthBudgetResolvers<ContextType>;
  Mutation: MutationResolvers<ContextType>;
  PaginatedTransactions: PaginatedTransactionsResolvers<ContextType>;
  Query: QueryResolvers<ContextType>;
  Transaction: TransactionResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = Context> = {
  authenticated: AuthenticatedDirectiveResolver<any, any, ContextType>;
};
