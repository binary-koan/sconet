class Transactions::UpdateSplitAmounts
  attr_reader :transaction

  def initialize(transaction)
    @transaction = transaction
  end

  def call
    return if transaction.split_to.blank?

    update_splits!(:amount_cents)
    update_splits!(:shop_amount_cents)
  end

  private

  def update_splits!(field)
    total_split_amount = transaction.split_to.map(&field).compact.sum

    return if total_split_amount.zero? || total_split_amount == transaction[field]

    ratio = transaction[field].to_d / total_split_amount

    transaction.split_to.each do |split|
      split[field] = ((split[field] || 0) * ratio).floor
    end

    update_index = 0
    loop do
      total = transaction.split_to.map(&field).compact.sum
      break if total == transaction[field]

      if total > transaction[field]
        transaction.split_to[update_index][field] -= 1
      else
        transaction.split_to[update_index][field] += 1
      end

      update_index = (update_index + 1) % transaction.split_to.length
    end

    transaction.split_to.each(&:save!)
  end
end
