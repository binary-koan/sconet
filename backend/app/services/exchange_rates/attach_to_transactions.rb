class ExchangeRates::AttachToTransactions
  attr_reader :transactions, :currency, :shop_amount

  def initialize(transactions, currency, shop_amount: false)
    @transactions = transactions
    @currency = currency
    @shop_amount = shop_amount
  end

  def call
    amounts = shop_amount ? transactions.map(&:shop_amount) : transactions.map(&:amount)
    values = ExchangeRates::ConvertMoney.new(amounts, to_currency: currency).call
    transactions.zip(values).each do |transaction, value|
      if shop_amount
        transaction.shop_amount_in_currency = value
      else
        transaction.amount_in_currency = value
      end
    end
  end
end
