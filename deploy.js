const envFile = await Bun.file("web/.env").text()
const value = envFile.match(/TURNSTILE_SITEKEY=(\S+)/)[1]

if (!value) {
  throw new Error("Expected TURNSTILE_SITEKEY to be present")
}

console.log(`fly deploy --build-arg TURNSTILE_SITEKEY=${value}`)

Bun.spawnSync(["fly", "deploy", "--build-arg", `TURNSTILE_SITEKEY=${value}`], {
  stdout: "inherit",
  stderr: "inherit"
})
