import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { CallToAction } from '@/components/home/CallToAction';

export default function Home() {
  return (
    <main className="flex flex-col gap-16">
      <HeroSection />
      <FeaturedCategories />
      <CallToAction />
    </main>
  );
}
