import { Section, Container } from '@/components/craft';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface HeroBasicProps {
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bgColor?: string;
}

export function HeroBasic({
  title,
  subtitle,
  primaryCtaText,
  primaryCtaHref = '#',
  secondaryCtaText,
  secondaryCtaHref = '#',
  bgColor = 'bg-gray-900',
}: HeroBasicProps) {
  return (
    <div className={`${bgColor} py-24 sm:py-32`}>
      <Section>
        <Container className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            {title}
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            {subtitle}
          </p>
          
          {(primaryCtaText || secondaryCtaText) && (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {primaryCtaText && (
                <Button asChild size="lg">
                  <Link href={primaryCtaHref}>{primaryCtaText}</Link>
                </Button>
              )}
              {secondaryCtaText && (
                <Link href={secondaryCtaHref} className="text-sm/6 font-semibold text-white">
                  {secondaryCtaText} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

