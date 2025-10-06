import { Section, Container } from '@/components/craft';

export interface TestMinimalProps {
  content: string;
}

export function TestMinimal({ content = 'Hello World' }: TestMinimalProps) {
  return (
    <Section>
      <Container>
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-2xl font-bold mb-4">Test Minimal Block</h3>
          <p className="text-lg">{content}</p>
          <p className="text-sm text-muted-foreground mt-4">
            ✅ This block is rendering from WordPress data!
          </p>
        </div>
      </Container>
    </Section>
  );
}

