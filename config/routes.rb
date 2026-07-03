Rails.application.routes.draw do
  post "/graphql", to: "graphql#execute"
  post "/mcp", to: "mcp#execute"
  post "/mcp/:token", to: "mcp#execute"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "*path", to: "frontend#index", constraints: ->(request) { !request.path.start_with?("/rails") }
end
