module Resolvers
  class CurrentUserResolver < BaseResolver
    authenticated

    type Types::CurrentUserType, null: false

    def resolve
      current_user
    end
  end
end
