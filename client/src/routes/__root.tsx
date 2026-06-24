import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Navbar"

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
