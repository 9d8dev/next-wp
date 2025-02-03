"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="h-12 sm:h-10 px-8 rounded-xl cursor-pointer w-full sm:w-auto text-base font-medium shadow-lg hover:shadow-xl transition-all"
      disabled={pending}
    >
      {pending ? "Processing..." : "Request Early Access"}
    </Button>
  )
}
