"use client";

import { type ReactNode, useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as _PostHogProvider } from "posthog-js/react";
import PostHogPageView from "@/components/posthog-pageview";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  return (
    <_PostHogProvider client={posthog}>
      {children}
      <PostHogPageView />
    </_PostHogProvider>
  );
}
