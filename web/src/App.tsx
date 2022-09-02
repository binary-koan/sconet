import { Routes, Route, Link } from "@solidjs/router"
import type { Component } from "solid-js"

const App: Component = () => {
  return (
    <Routes>
      <Route path="/users" element={<div>Users</div>} />
      <Route
        path="/"
        element={
          <div>
            Home <Link href="/about">About</Link>
          </div>
        }
      />
      <Route path="/about" element={<div>About</div>} />
    </Routes>
  )
}

export default App
