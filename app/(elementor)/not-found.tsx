import Link from "next/link";
import { Section, Container, Prose } from "@/components/craft";

export default function ElementorNotFound() {
  return (
    <Section>
      <Container className="space-y-8 text-center">
        <Prose>
          <h1>Elementor Page Not Found</h1>
          <p>
            The Elementor page you're looking for doesn't exist or couldn't be loaded.
          </p>
        </Prose>
        
        <div className="space-y-4">
          <Link 
            href="/elementor" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View All Elementor Pages
          </Link>
          <br />
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </Section>
  );
}