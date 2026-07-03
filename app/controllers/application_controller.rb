class ApplicationController < ActionController::API
  def current_user
    @current_user ||= begin
      token = request.headers['Authorization']&.split(' ')&.last

      if token&.start_with?(ApiKey::TOKEN_PREFIX)
        ApiKey.authenticate(token)
      else
        User.find_by_jwt(token)
      end
    end
  end
end
