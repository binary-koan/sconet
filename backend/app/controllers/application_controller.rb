class ApplicationController < ActionController::API
  def current_user
    @current_user ||= User.find_by_jwt(request.headers['Authorization'].split(' ').last)
  end
end
