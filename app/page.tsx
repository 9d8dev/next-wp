import { Main, Section, Container } from "@/components/craft";
import Balancer from "react-wrap-balancer";

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

const ExampleJsx = () => {
  return (
    <article className="prose-m-none">
      <h1>
        <Balancer>
          Hello World, welcome to the Next.js and{" "}
          <a href="https://github.com/brijr/craft">brijr/craft</a> Starter!
        </Balancer>
      </h1>
      <a className="h-16 block" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbrijr%2Fcraft-starter">
        {/* eslint-disable-next-line */}
        <img
          className="not-prose my-4"
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
        />
      </a>
      <p>
        Welcome to the{" "}
        <a href="https://github.com/brijr/craft-starter">Craft Starter</a> by{" "}
        <a href="https://bridger.to">Bridger Tower</a>. This Next JS template
        has been set up based on the recommended{" "}
        <a
          className="underline"
          href="https://ui.shadcn.com/docs/installation/next"
        >
          Shadcn/ui Next.js setup
        </a>
        . Use this template paired with{" "}
        <a href="https://components.bridger.to">brijr/components</a> for rapid
        building.
      </p>
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
