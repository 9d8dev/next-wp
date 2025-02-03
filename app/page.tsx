import Image from "next/image";
import { Input } from "@/components/ui/input";
import { subscribeToWaitlist } from "@/app/actions";
import { SubmitButton } from "./submit-button";

export default function Hero() {
  return (
    <div className="min-h-screen bg-[radial-gradient(at_68%_92%,rgba(151,71,255,0.8)_0px,transparent_50%),radial-gradient(at_35%_84%,rgba(255,183,3,0.9)_0px,transparent_50%)]">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center pt-6 md:pt-24 pb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight md:leading-tight mb-6 selection:bg-primary selection:text-secondary">
            <span className="bg-gradient-to-r from-amber-500 to-primary text-transparent bg-clip-text">
              AI-powered&nbsp;
            </span>
            <span className="relative mx-2">
              <Image
                src="/images/long-avatar.png"
                alt="Avatar group"
                width={120}
                height={60}
                className="inline-block shadow-xl rounded-full selection:bg-transparent selection:text-transparent"
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
                  className="hidden md:inline-block selection:bg-transparent selection:text-transparent"
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
            className="max-w-lg mx-auto relative px-4 sm:px-0"
          >
            <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center">
              <Input
                required
                id="email"
                name="email"
                className="peer h-12 text-lg sm:text-2xl focus:ring-violet-400/60 focus-visible:ring-violet-400/60 focus:ring-2 focus-visible:ring-2 rounded-xl md:rounded-2xl border-none shadow-xl sm:pr-[180px]"
                placeholder="  future.hire@email.com"
                type="email"
              />
              <div className="sm:absolute sm:right-1 z-10 flex justify-center">
                <SubmitButton />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
