# frozen_string_literal: true

module Mutations
  class CurrentUserTokenGenerate < BaseMutation
    authenticated

    field :token, String, null: false

    def resolve
      { token: current_user.generate_jwt }
    end
  end
end
