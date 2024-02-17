class Money < Data.define(:amount_cents, :currency)
  def +(other)
    raise ArgumentError, "Currency mismatch" unless currency == other.currency

    self.class.new(**self.to_h, amount_cents: amount_cents + other.amount_cents)
  end

  def -(other)
    raise ArgumentError, "Currency mismatch" unless currency == other.currency

    self.class.new(**self.to_h, amount_cents: amount_cents - other.amount_cents)
  end

  def abs
    self.class.new(**self.to_h, amount_cents: amount_cents.abs)
  end

  def amount_decimal
    amount_cents.to_d / (10 ** currency.decimal_digits)
  end

  def formatted
    "#{sign}#{currency.symbol}#{format('%.2f', amount_decimal.abs)}"
  end

  def formatted_short
    amount = amount_decimal.abs.round
    suffix = ""

    if amount > 1_000_000
      amount = (amount / 1_000_000).round
      suffix = "M"
    elsif amount > 10_000
      amount = (amount / 1_000).round
      suffix = "K"
    end

    return "#{sign}#{currency.symbol}#{amount}#{suffix}"
  end

  def on_date(date)
    MoneyOnDate.new(currency:, date:, amount_cents:)
  end

  private

  def sign
    amount_cents < 0 ? "-" : ""
  end
end
