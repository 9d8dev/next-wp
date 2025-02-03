import Image from "next/image"
import { Input } from "@/components/ui/input"
import { subscribeToWaitlist } from "@/app/actions"
import { SubmitButton } from "./submit-button"

export default function Hero() {
  return (
    <div className="min-h-screen">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center pt-24 pb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight md:leading-tight mb-6 selection:bg-primary selection:text-secondary">
            <span className="bg-gradient-to-r from-amber-500 to-primary text-transparent bg-clip-text">
              AI-powered&nbsp;
            </span>
            <span className="relative mx-2">
              <Image
                src="/images/long-avatar.png"
                alt="Avatar group"
                width={120}
                height={60}
                className="inline-block shadow-xl rounded-full"
              />
            </span>
            <span className="inline-flex items-center">
              <span className="mx-2">first round interviews</span>
            </span>
            <br />
            <span className="inline-flex items-center">
              Uncover true talent
              <span className="relative mx-2">
                <Image
                  src="/images/avatar-group.png"
                  alt="Avatar group"
                  width={120}
                  height={60}
                  className="inline-block"
                />
              </span>
            </span>
            <br />
            beyond resumes.
          </h1>

          <p className="text-sm text-muted-foreground selection:bg-primary selection:text-secondary max-w-2xl mx-auto mb-12">
            At Goodfit, we use AI to conduct first round video interviews to
            assess skills and personality, saving you hours of screening.
          </p>

          <form
            // @ts-expect-error
            action={subscribeToWaitlist}
            className="max-w-md mx-auto relative"
          >
            <div className="space-y-2">
              <div className="relative flex items-center">
                <Input
                  id="email"
                  className="peer h-12 pr-[180px] text-3xl focus:ring-violet-400/60 focus-visible:ring-violet-400/60 focus:ring-2 focus-visible:ring-2 rounded-2xl border-none shadow-xl"
                  placeholder="  future.hire@email.com" // clumsy little trick to simulate padding left on placeholder
                  type="email"
                />
                <div className="absolute right-1 z-10">
                  <SubmitButton />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
