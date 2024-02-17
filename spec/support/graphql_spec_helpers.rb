module GraphqlSpecHelpers
  def execute_graphql(query_string:, variables: {}, current_user: nil)
    @graphql_result = SconetSchema.execute(query_string, variables:, context: { current_user: })
  end

  def graphql_data
    @graphql_result["data"]
  end

  def expect_graphql_success
    expect(@graphql_result["errors"]).to be_nil
  end

  def expect_graphql_error(error_class)
    if @graphql_result["errors"].blank?
      raise "Expected an error of type #{error_class}, but no errors were returned. Data: #{@graphql_result["data"]}"
    end

    if @graphql_result["errors"].first.dig("extensions", "code") != error_class.code
      raise "Expected an error of type #{error_class}, but got: #{@graphql_result["errors"]}"
    end
  end
end
