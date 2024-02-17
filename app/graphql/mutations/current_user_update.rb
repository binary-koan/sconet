# frozen_string_literal: true

module Mutations
  class CurrentUserUpdate < BaseMutation
    authenticated

    description "Updates the current user"

    field :current_user, Types::CurrentUserType, null: false

    argument :user_input, Types::UserInputType, required: true

    def resolve(user_input:)
      updates = { **user_input }

      if updates[:old_password] && updates[:new_password]
        raise GraphqlErrors::AuthenticationFailedError, "Invalid password" unless current_user.authenticate(updates.delete(:old_password))
        updates[:password] = updates.delete(:new_password)
      end

      current_user.update!(**updates)

      { current_user: }
    end
  end
end
