class ExchangeRates::Fetch
  class FetchFailedError < StandardError; end

  attr_reader :from_currency, :date

  def initialize(from_currency, date)
    @from_currency = from_currency
    @date = date
  end

  def call
    response = fetch_exchange_rate(date) || fetch_exchange_rate("latest") || raise(FetchFailedError, "Failed to fetch exchange rate")
    return if response.nil?

    save_exchange_rates(response)
  end

  private

  def save_exchange_rates(response)
    Currency.all.map do |currency|
      next if currency == from_currency

      ExchangeRateValue.create!(
        from_currency:,
        to_currency: currency,
        date:,
        rate: response[from_currency.code.downcase][currency.code.downcase]
      )
    end
  end

  def fetch_exchange_rate(date)
    response = Faraday.get("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/#{date}/currencies/#{from_currency.code.downcase}.json")
    return if response.status != 200

    JSON.parse(response.body)
  end
end
