class ExchangeRates::Fetch
  class FetchFailedError < StandardError; end

  attr_reader :from_currency, :date

  def initialize(from_currency, date)
    @from_currency = from_currency
    @date = date
  end

  def call
    response = fetch_exchange_rate(formatted_date) || fetch_exchange_rate("latest") || raise(FetchFailedError, "Failed to fetch exchange rate")
    return if response.nil?

    save_exchange_rates(response)
  end

  private

  def formatted_date
    date.strftime("%Y.%-m.%-d")
  end

  def save_exchange_rates(response)
    Currency.all.map do |currency|
      ExchangeRateValue.create!(
        from_currency:,
        to_currency: currency,
        date:,
        rate: currency == from_currency ? 1 : response[from_currency.code.downcase][currency.code.downcase]
      )
    end
  end

  def fetch_exchange_rate(date)
    response = Faraday.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@#{date}/v1/currencies/#{from_currency.code.downcase}.json")
    return if response.status != 200

    JSON.parse(response.body)
  end
end
