import { Section, Container } from '@/components/craft';

export interface HeroUltraSimpleProps {
  title?: string;
  subtitle?: string;
}

export function HeroUltraSimple({ title, subtitle }: HeroUltraSimpleProps) {
  return (
    <Section className="bg-gray-900 text-white py-24">
      <Container className="text-center">
        <h1 className="text-5xl font-bold mb-4">{title || 'Enter title...'}</h1>
        <p className="text-xl text-gray-400">{subtitle || 'Enter subtitle...'}</p>
      </Container>
    </Section>
  );
}

