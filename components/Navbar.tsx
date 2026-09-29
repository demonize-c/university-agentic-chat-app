"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  FileTextIcon, 
  HomeIcon, 
  BotIcon
} from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BotIcon className="size-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">UniChat Portal</span>
          </Link>
          <nav className="flex items-center gap-1 text-xs">
            <Button
              asChild
              variant={pathname === "/" ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/">
                <HomeIcon className="mr-1.5 size-3.5" />
                Home
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/documents" ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href="/documents">
                <FileTextIcon className="mr-1.5 size-3.5" />
                Documents
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/documents">
              <FileTextIcon className="mr-1.5 size-3.5" />
              Manage Documents
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
