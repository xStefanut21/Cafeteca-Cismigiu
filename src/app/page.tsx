import { HeroSection } from '@/components/home/HeroSection';
import FeaturedCategoriesDynamic from '@/components/home/FeaturedCategoriesDynamic';
import { CallToAction } from '@/components/home/CallToAction';

export default function Home() {
  return (
    <main className="flex flex-col gap-16">
      <HeroSection />
      <FeaturedCategoriesDynamic />
      <CallToAction />
    </main>
  );
}
