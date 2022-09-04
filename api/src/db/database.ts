import { Database, Statement } from "bun:sqlite"

const sqlite = new Database("data.sqlite")

export const db: Database = {
  run(sqlQuery, ...bindings): void {
    console.log(`[SQLITE:RUN] ${sqlQuery}`)
    console.log(`[SQLITE:RUN BINDINGS] ${JSON.stringify(bindings)}`)
    sqlite.run(sqlQuery, ...bindings)
  },

  exec(sqlQuery, ...bindings) {
    console.log(`[SQLITE:RUN] ${sqlQuery}`)
    console.log(`[SQLITE:RUN BINDINGS] ${JSON.stringify(bindings)}`)
    sqlite.exec(sqlQuery, ...bindings)
  },

  query(sqlQuery) {
    return wrapStatement(sqlQuery, [], sqlite.query(sqlQuery))
  },

  prepare(sqlQuery, ...params) {
    return wrapStatement(sqlQuery, params, sqlite.prepare(sqlQuery, ...params))
  },

  get inTransaction() {
    return sqlite.inTransaction
  },

  close() {
    sqlite.close()
  },

  get filename() {
    return sqlite.filename
  },

  get handle() {
    return sqlite.handle
  },

  loadExtension(extension, entryPoint) {
    sqlite.loadExtension(extension, entryPoint)
  },

  transaction(insideTransaction) {
    const transaction = sqlite.transaction(insideTransaction)

    const call = () => {
      console.log("[SQLITE:TRANSACTION BEGIN]")
      transaction()
      console.log("[SQLITE:TRANSACTION END]")
    }

    call.immediate = () => {
      console.log("[SQLITE:TRANSACTION IMMEDIATE BEGIN]")
      transaction.immediate()
      console.log("[SQLITE:TRANSACTION IMMEDIATE END]")
    }

    call.deferred = () => {
      console.log("[SQLITE:TRANSACTION DEFERRED BEGIN]")
      transaction.deferred()
      console.log("[SQLITE:TRANSACTION DEFERRED END]")
    }

    call.exclusive = () => {
      console.log("[SQLITE:TRANSACTION EXCLUSIVE BEGIN]")
      transaction.exclusive()
      console.log("[SQLITE:TRANSACTION EXCLUSIVE END]")
    }

    return call
  }
}

function wrapStatement(sqlQuery: string, defaultParams: any[], query: Statement<any, any>) {
  return {
    all(...params: any[]) {
      console.log(`[SQLITE:ALL] ${sqlQuery.trim()}`)
      logBindings("[SQLITE:ALL BINDINGS]", defaultParams, params)
      return query.all(...params)
    },

    get(...params: any[]) {
      console.log(`[SQLITE:GET] ${sqlQuery.trim()}`)
      logBindings("[SQLITE:GET BINDINGS]", defaultParams, params)
      return query.get(...params)
    },

    run(...params: any[]) {
      console.log(`[SQLITE:RUN] ${sqlQuery.trim()}`)
      logBindings("[SQLITE:RUN BINDINGS]", defaultParams, params)
      query.run(...params)
    },

    get columnNames() {
      return query.columnNames
    },

    values(...params: any[]) {
      console.log(`[SQLITE:VALUES] ${sqlQuery.trim()}`)
      logBindings("[SQLITE:VALUES BINDINGS]", defaultParams, params)
      return query.values(...params)
    },

    get paramsCount() {
      return query.paramsCount
    },

    finalize() {
      query.finalize()
    },

    get native() {
      return query.native
    }
  }
}

function logBindings(message: string, ...bindings: any[][]) {
  bindings = bindings.filter((array) => array.length > 0)

  if (bindings.length === 1 && bindings[0].length === 1) {
    console.log(message, bindings[0][0])
  } else if (bindings.length > 0) {
    console.log(message, bindings)
  }
}
