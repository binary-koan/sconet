## accounts

- _id_ uuid (default: `uuid_generate_v4()`)
- _deletedAt_ timestamp without time zone
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _name_ text

## categories

- _id_ uuid (default: `uuid_generate_v4()`)
- _isRegular_ boolean
- _budget_ integer
- _sortOrder_ integer
- _deletedAt_ timestamp without time zone
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _name_ text
- _color_ text
- _icon_ text
- _budgetCurrencyCode_ text

## dailyExchangeRates

- _id_ uuid (default: `uuid_generate_v4()`)
- _date_ date
- _deletedAt_ timestamp without time zone
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _fromCurrencyCode_ text

## exchangeRateValues

- _id_ uuid (default: `uuid_generate_v4()`)
- _rate_ real
- _deletedAt_ timestamp without time zone
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _dailyExchangeRateId_ text
- _toCurrencyCode_ text

## transactions

- _id_ uuid (default: `uuid_generate_v4()`)
- _date_ date
- _includeInReports_ integer
- _amount_ integer
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _deletedAt_ timestamp without time zone
- _memo_ text
- _originalMemo_ text
- _currencyCode_ text
- _categoryId_ text
- _accountId_ text
- _remoteId_ text
- _splitFromId_ text

## userCredentials

- _id_ uuid (default: `uuid_generate_v4()`)
- _credentialId_ bytea
- _credentialPublicKey_ bytea
- _counter_ integer
- _deletedAt_ timestamp without time zone
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _userId_ text
- _device_ text

## users

- _id_ uuid (default: `uuid_generate_v4()`)
- _settings_ jsonb
- _createdAt_ timestamp without time zone
- _updatedAt_ timestamp without time zone
- _deletedAt_ timestamp without time zone
- _webauthnChallenge_ text
- _email_ text
- _encryptedPassword_ text