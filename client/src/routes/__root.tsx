import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CustomCursor } from "@/components/CustomCursor"

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <CustomCursor />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
})
