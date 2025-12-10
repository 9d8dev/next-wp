import { Section, Container, Prose } from "@/components/craft";

export default function Loading() {

  return (
    <Section>
      <Container>
        <Prose>
          <h2>All Posts</h2>
          <p className="text-muted-foreground">Loading posts...</p>
        </Prose>
      </Container>
    </Section>
  )
}
