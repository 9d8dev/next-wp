"use client";

import {Container, Section} from "@/components/craft";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <Section>
            <Container>
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
                    <p className="mb-2 text-gray-600">
                        We encountered an error while loading this page.
                    </p>
                    <p className="mb-8 text-sm text-gray-500">
                        Please try again or contact us if the problem persists.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={() => reset()} className="not-prose">
                            Try Again
                        </Button>
                        <Button asChild variant="outline" className="not-prose">
                            <Link href="/">Return Home</Link>
                        </Button>
                    </div>
                </div>
            </Container>
        </Section>
    );
}