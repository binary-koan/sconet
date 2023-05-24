export const PRODUCTION_BUILD = Bun.env.PRODUCTION_BUILD!
export const TURNSTILE_SITEKEY = Bun.env.TURNSTILE_SITEKEY!

// Used in the build script to pass through env vars
export const ENV_VARS = { PRODUCTION_BUILD, TURNSTILE_SITEKEY }
