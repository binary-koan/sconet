module GraphqlHelpers
  extend ActiveSupport::Concern

  class_methods do
    def authenticated
      define_method(:authorized?) do |*args|
        if current_user.blank?
          raise GraphqlErrors::UnauthorizedError, 'You need to sign in to perform this action'
        end
        true
      end
    end
  end

  def current_user
    context[:current_user]
  end
end
