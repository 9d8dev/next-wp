import { Section, Container } from "@/components/craft";
import { Metadata } from "next";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Browse all pages of our blog posts",
};

export default async function Page() {

  return (
    <Section>
      <Container>
        <div className="flex justify-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <Star  />
            <div className="text-base font-bold">4.4 <span className="text-black/30 dark:text-white/30">.25 REVIEWS</span></div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Star  />
            <div className="text-base font-bold ">4.4 <span className="text-black/30 dark:text-white/20">.25 REVIEWS</span></div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
