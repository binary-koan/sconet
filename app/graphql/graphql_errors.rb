module GraphqlErrors
  class BaseError < GraphQL::ExecutionError
    def self.code(code = nil)
      if code.present?
        @code = code
      else
        @code
      end
    end

    def to_h
      code = self.class.instance_variable_get(:@code)
      super.merge({ "extensions" => { "code" => code } })
    end
  end

  class UnauthorizedError < BaseError
    code "UNAUTHORIZED"
  end

  class AuthenticationFailedError < BaseError
    code "AUTHENTICATION_FAILED"
  end

  class NotFoundError < BaseError
    code "NOT_FOUND"
  end

  class ValidationError < BaseError
    code "VALIDATION_ERROR"
  end
end
