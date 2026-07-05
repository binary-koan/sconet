class McpController < ApplicationController
  def execute
    return head :unauthorized unless authenticated_user

    server = MCP::Server.new(
      name: "sconet",
      version: "1.0.0",
      tools: McpTools::ALL,
      server_context: { current_user: authenticated_user }
    )

    result = server.handle_json(request.body.read)
    result ? render(json: result) : head(:accepted)
  end

  # Receipt images upload here directly so their bytes don't have to travel
  # base64-encoded inside an MCP tool call; create_transaction takes the
  # returned signed_id as receipt_images[].blob_signed_id.
  def upload
    return head :unauthorized unless authenticated_user

    file = params.require(:file)
    blob = ActiveStorage::Blob.create_and_upload!(
      io: file,
      filename: file.original_filename,
      content_type: file.content_type
    )

    render json: { blob_signed_id: blob.signed_id, filename: blob.filename.to_s }
  end

  private

  def authenticated_user
    # Token-in-URL for clients that can't send custom headers (e.g. claude.ai connectors)
    @authenticated_user ||= params[:token] ? ApiKey.authenticate(params[:token]) : current_user
  end
end
