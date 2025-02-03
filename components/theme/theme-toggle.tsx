"use client"

import * as React from "react"

import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"
import { Moon, SunDim } from "lucide-react"

import { Button } from "@/components/ui/button"

type Theme = "light" | "dark" | "system"

const KEYS = ["ctrl+u", "meta+u"]

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const handleChangeTheme = (theme: Theme) => {
    // if (!document.startViewTransition) return setTheme(theme);
    // document.startViewTransition(() => setTheme(theme));
    setTheme(theme)
  }

  useHotkeys(KEYS, () => {
    handleChangeTheme(theme === "light" ? "dark" : "light")
  })

  return (
    <div className="fixed bottom-2 left-4 z-50">
      <Button
        variant="outline"
        onKeyDown={() => handleChangeTheme(theme === "dark" ? "light" : "dark")}
        onClick={() => handleChangeTheme(theme === "dark" ? "light" : "dark")}
        size="icon"
      >
        {theme === "dark" ? (
          <Moon className="size-5" />
        ) : (
          <SunDim className="size-5" />
        )}
      </Button>
    </div>
  )
}
