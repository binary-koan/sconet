# frozen_string_literal: true

module Mutations
  class FavouriteCurrencyToggle < BaseMutation
    authenticated

    field :current_user, Types::CurrentUserType, null: false

    argument :id, ID, required: true
    argument :favourite, Boolean, required: true

    def resolve(id:, favourite:)
      currency = Currency.find_by!(id:)

      if favourite
        current_user.user_currency_favourites.find_or_create_by!(currency:)
      else
        current_user.user_currency_favourites.find_by(currency:)&.destroy!
      end

      { current_user: }
    end
  end
end
