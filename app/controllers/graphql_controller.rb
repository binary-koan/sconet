# frozen_string_literal: true

class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  # protect_from_forgery with: :null_session

  def execute
    # Handle multipart/form-data uploads (GraphQL multipart request spec)
    if params[:operations].present?
      operations = JSON.parse(params[:operations])
      query = operations['query']
      variables = operations['variables'] || {}
      operation_name = operations['operationName']
      
      # Map uploaded files back to their positions in variables
      if params[:map].present?
        file_map = JSON.parse(params[:map])
        file_map.each do |file_index, paths|
          file = params[file_index]
          paths.each do |path|
            # path format: "variables.input.receiptImages.0"
            set_nested_value(variables, path.sub('variables.', ''), file)
          end
        end
      end
    else
      variables = prepare_variables(params[:variables])
      query = params[:query]
      operation_name = params[:operationName]
    end
    
    context = { current_user: }
    result = SconetSchema.execute(query, variables:, context:, operation_name:)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
  end

  private
  
  # Set a nested value in a hash using a dot-separated path
  def set_nested_value(hash, path, value)
    keys = path.split('.')
    last_key = keys.pop
    
    # Navigate to the nested hash/array
    target = keys.reduce(hash) do |current, key|
      if key =~ /^\d+$/
        # Array index
        current[key.to_i]
      else
        # Hash key (convert to symbol for GraphQL)
        current[key.to_sym] || current[key]
      end
    end
    
    # Set the value
    if last_key =~ /^\d+$/
      target[last_key.to_i] = value
    else
      target[last_key.to_sym] = value
    end
  end

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [{ message: e.message, backtrace: e.backtrace }], data: {} }, status: 500
  end
end
