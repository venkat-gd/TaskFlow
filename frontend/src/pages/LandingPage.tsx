import { HeroSection } from '@/components/landing/HeroSection';
import { ArchitectureDiagram } from '@/components/landing/ArchitectureDiagram';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { TechStack } from '@/components/landing/TechStack';
import { CTASection } from '@/components/landing/CTASection';

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <ArchitectureDiagram />
      <FeatureCards />
      <TechStack />
      <CTASection />
    </div>
  );
}
