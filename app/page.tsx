// Craft Imports
import { Main, Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Components
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <Main>
      <Section>
        <Container>
          <ExampleJsx />
        </Container>
      </Section>
    </Main>
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
      <hr />
      <h2>Example Heading</h2>
      <p>
        This is an example paragraph to illustrate what an article section might
        look like in this context. You can add more content here to expand on
        the topic and provide more detailed information to your readers.
      </p>
      <ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
        <li>List Item 3</li>
      </ul>
      <h3>This is an example H3</h3>
      <p>
        Further explore the topic by discussing relevant points, providing
        insights, or sharing experiences that can engage the audience. An
        article is not just about listing information but also about
        storytelling and conveying a message that resonates with the readers.
      </p>
      <pre>
        <code>
          {`// This is an example code block
function exampleFunction() {
  console.log("This is a code snippet.");
}`}
        </code>
      </pre>
      <p>
        Lastly, you may want to conclude with a summary or a call-to-action that
        encourages readers to take the next steps, such as learning more about a
        subject or getting involved in a community discussion.
      </p>
      <blockquote>
        This is an example blockquote. It can be used to highlight important
        information or quotes from other sources.
      </blockquote>
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
            <td>Data 3</td>
          </tr>
          <tr>
            <td>Data 4</td>
            <td>Data 5</td>
            <td>Data 6</td>
          </tr>
        </tbody>
      </table>
      <figure>
        {/* eslint-disable-next-line */}
        <img
          src="https://i.pinimg.com/564x/fc/f0/c2/fcf0c274e3f20b0ea3b27a9c04f0269c.jpg"
          alt="Example Image"
        />
        <figcaption>This is an example figure caption.</figcaption>
      </figure>
    </article>
  );
};
