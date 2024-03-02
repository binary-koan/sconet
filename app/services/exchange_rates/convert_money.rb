class ExchangeRates::ConvertMoney
  attr_reader :money_on_dates, :to_currency

  def initialize(money_on_dates, to_currency:)
    @money_on_dates = money_on_dates
    @to_currency = to_currency
  end

  def call
    list = money_on_dates.map do |money|
      next if money.blank?
      next money if money.currency == to_currency

      MoneyOnDate.new(
        currency: to_currency,
        date: money.date,
        amount_cents: money.amount_cents * exchange_rates[[money.date, money.currency]]
      )
    end

    Monies.new(list, to_currency)
  end

  private

  def exchange_rates
    @exchange_rates ||= existing_exchange_rates.merge(sync_exchange_rates)
  end

  def sync_exchange_rates
    index_rates((needed_exchange_rates - existing_exchange_rates.keys).map do |date, from_currency|
      ExchangeRates::Fetch.new(from_currency, date).call.find do |rate|
        rate.to_currency == to_currency
      end
    end)
  end

  def existing_exchange_rates
    @existing_exchange_rates ||= index_rates(ExchangeRateValue.
      includes(:from_currency, :to_currency).
      where(to_currency:, date: money_on_dates.compact.map(&:date).uniq))
  end

  def index_rates(rates)
    rates.to_h do |rate|
      [[rate.date, rate.from_currency], rate.rate]
    end
  end

  def needed_exchange_rates
    money_on_dates.
      compact.
      select { |money| money.currency != to_currency }.
      map { |money| [money.date, money.currency] }.
      uniq
  end
end
