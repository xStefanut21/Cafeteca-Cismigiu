import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-amber-50 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Bun venit la Cafeteca Cismigiu
          </h1>
          <p className="text-xl text-amber-800 mb-8 max-w-2xl mx-auto">
            Descoperă arome autentice într-un ambient relaxant în inima Bucureștiului
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg">
              <Link href="/menu">Vezi meniul</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
