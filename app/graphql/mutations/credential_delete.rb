# frozen_string_literal: true

module Mutations
  class CredentialDelete < BaseMutation
    authenticated

    field :current_user, Types::CurrentUserType, null: false

    argument :id, ID, required: true

    def resolve(id:)
      current_user.user_credentials.find(id).mark_deleted!

      { current_user: }
    end
  end
end
