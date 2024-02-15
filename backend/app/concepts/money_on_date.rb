class MoneyOnDate < Money
  attr_reader :date

  def initialize(date:, **kwargs)
    @date = date
    super(**kwargs)
  end

  def to_h
    super.merge(date:)
  end
end
