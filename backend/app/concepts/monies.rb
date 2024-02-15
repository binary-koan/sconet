class Monies
  include Enumerable

  attr_reader :list, :currency

  def initialize(list, currency)
    @list = list
    @currency = currency
  end

  def sum
    list.reduce(&:+) || Money.new(amount_cents: 0, currency:)
  end

  def each(&block)
    list.each(&block)
  end
end
