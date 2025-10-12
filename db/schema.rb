# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_09_14_091500) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.uuid "currency_id", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
    t.boolean "favourite", default: false, null: false
    t.integer "sort_order", null: false
    t.index ["currency_id"], name: "index_accounts_on_currency_id"
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "color", null: false
    t.string "icon", null: false
    t.boolean "regular", default: false, null: false
    t.integer "sort_order", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "archived_at"
  end

  create_table "category_budgets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id", null: false
    t.date "date_from", null: false
    t.date "date_to"
    t.integer "budget_cents", null: false
    t.uuid "currency_id", null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_category_budgets_on_category_id"
    t.index ["currency_id"], name: "index_category_budgets_on_currency_id"
  end

  create_table "currencies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.string "symbol", null: false
    t.integer "decimal_digits", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "exchange_rate_values", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.date "date", null: false
    t.uuid "from_currency_id", null: false
    t.uuid "to_currency_id", null: false
    t.decimal "rate", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_currency_id"], name: "index_exchange_rate_values_on_from_currency_id"
    t.index ["to_currency_id"], name: "index_exchange_rate_values_on_to_currency_id"
  end

  create_table "favourite_transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "name", null: false
    t.string "shop", default: "", null: false
    t.string "memo", default: "", null: false
    t.integer "price_cents"
    t.uuid "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "category_id"
    t.index ["account_id"], name: "index_favourite_transactions_on_account_id"
    t.index ["category_id"], name: "index_favourite_transactions_on_category_id"
    t.index ["user_id"], name: "index_favourite_transactions_on_user_id"
  end

  create_table "transactions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "shop", default: "", null: false
    t.string "memo", default: "", null: false
    t.date "date", null: false
    t.boolean "include_in_reports", default: true, null: false
    t.integer "amount_cents"
    t.uuid "currency_id"
    t.integer "shop_amount_cents"
    t.uuid "shop_currency_id"
    t.uuid "category_id"
    t.uuid "account_id", null: false
    t.uuid "split_from_id"
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["category_id"], name: "index_transactions_on_category_id"
    t.index ["currency_id"], name: "index_transactions_on_currency_id"
    t.index ["shop_currency_id"], name: "index_transactions_on_shop_currency_id"
    t.index ["split_from_id"], name: "index_transactions_on_split_from_id"
  end

  create_table "user_credentials", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "device", null: false
    t.binary "credential_id", null: false
    t.binary "credential_public_key", null: false
    t.integer "counter", default: 0, null: false
    t.datetime "deleted_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_credentials_on_user_id"
  end

  create_table "user_currency_favourites", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "currency_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["currency_id"], name: "index_user_currency_favourites_on_currency_id"
    t.index ["user_id"], name: "index_user_currency_favourites_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "webauthn_challenge"
    t.uuid "default_currency_id"
    t.uuid "default_account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["default_account_id"], name: "index_users_on_default_account_id"
    t.index ["default_currency_id"], name: "index_users_on_default_currency_id"
  end

end
