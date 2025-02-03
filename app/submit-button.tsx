"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      data-pending={pending}
      onClick={() => {}}
      className="group relative mx-auto grid rounded-xl transition-all active:scale-95"
    >
      <span className="font-semibold [grid-area:1/-1] group-data-[pending=true]:invisible">
        Request Early Access
      </span>
      <span className="invisible flex items-center justify-center gap-2 [grid-area:1/-1] group-data-[pending=true]:visible">
        <div className="size-4 border-[1.6px] border-t-purple-500 border-purple-400/20 rounded-full animate-spin" />
        Processing Request
      </span>
    </Button>
  );
}
