# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :account_archive, mutation: Mutations::AccountArchive
    field :account_create, mutation: Mutations::AccountCreate
    field :account_delete, mutation: Mutations::AccountDelete
    field :account_update, mutation: Mutations::AccountUpdate
    field :accounts_reorder, mutation: Mutations::AccountsReorder
    field :categories_reorder, mutation: Mutations::CategoriesReorder
    field :category_archive, mutation: Mutations::CategoryArchive
    field :category_create, mutation: Mutations::CategoryCreate
    field :category_delete, mutation: Mutations::CategoryDelete
    field :category_update, mutation: Mutations::CategoryUpdate
    field :credential_delete, mutation: Mutations::CredentialDelete
    field :credential_login_start, mutation: Mutations::CredentialLoginStart
    field :credential_register, mutation: Mutations::CredentialRegister
    field :credential_registration_start, mutation: Mutations::CredentialRegistrationStart
    field :current_user_update, mutation: Mutations::CurrentUserUpdate
    field :favourite_currency_toggle, mutation: Mutations::FavouriteCurrencyToggle
    field :login, mutation: Mutations::Login
    field :transaction_create, mutation: Mutations::TransactionCreate
    field :transaction_delete, mutation: Mutations::TransactionDelete
    field :transaction_split, mutation: Mutations::TransactionSplit
    field :transaction_update, mutation: Mutations::TransactionUpdate
  end
end
