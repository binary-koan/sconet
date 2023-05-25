Bun.spawnSync(["fly", "deploy", "--build-arg", `TURNSTILE_SITEKEY=${Bun.env.TURNSTILE_SITEKEY}`], {
  stdout: "inherit",
  stderr: "inherit"
})
