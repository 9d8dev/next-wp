// Craft Imports
import { Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Components
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <Section>
      <Container>
        <ExampleJsx />
      </Container>
    </Section>
  );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const ExampleJsx = () => {
  return (
    <article className="prose-m-none">
      <h1>
        <Balancer>
          Hello World, welcome to the Next.js and WordPress Starter by{" "}
          <a href="https://9d8.dev">9d8</a>.
        </Balancer>
      </h1>
      {/* Vercel Clone Starter */}
      <a
        className="h-16 block"
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrijr%2Fcraft-starter"
      >
        {/* eslint-disable-next-line */}
        <img
          className="not-prose my-4"
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
        />
      </a>
      <p>
        This is <a href="https://github.com/9d8dev/next-wp">next-wp</a>, created
        as a way to build Wordpress sites with Next.js at rapid speed. This
        starter is designed with <a href="https://ui.shadcn.com">shadcn/ui</a>,{" "}
        <a href="https://github.com/brijr/craft">brijr/craft</a>, and Tailwind
        CSS. Use <a href="https://components.bridger.to">brijr/components</a> to
        build your site with prebuilt components. The data fetching and
        typesafety is handled in <code>lib/wordpress.ts</code> and{" "}
        <code>lib/wordpress.d.ts</code>. Questions? Email 9d8dev@gmail.com
      </p>
      <div className="flex flex-wrap gap-2 mt-6 not-prose">
        <Button variant="outline" asChild>
          <Link href="/posts">Posts</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/posts/tags">Tags</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/posts/categories">Categories</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/posts/authors">Authors</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pages">Pages</Link>
        </Button>
      </div>
    </article>
  );
};
