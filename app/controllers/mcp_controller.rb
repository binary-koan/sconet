class McpController < ApplicationController
  def execute
    # Token-in-URL for clients that can't send custom headers (e.g. claude.ai connectors)
    user = params[:token] ? ApiKey.authenticate(params[:token]) : current_user
    return head :unauthorized unless user

    server = MCP::Server.new(
      name: "sconet",
      version: "1.0.0",
      tools: McpTools::ALL,
      server_context: { current_user: user }
    )

    result = server.handle_json(request.body.read)
    result ? render(json: result) : head(:accepted)
  end
end
