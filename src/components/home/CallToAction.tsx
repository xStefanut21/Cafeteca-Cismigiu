import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section className="bg-amber-800 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Te așteptăm să ne vizitezi chiar astăzi!
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          La Cafeteca nu vii doar pentru cafea, vii pentru o experiență completă.<br /><br />
          Arome din cele mai exotice colțuri ale lumii, o atmosferă cozy și un vibe pe care vrei să-l iei cu tine acasă.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="text-lg bg-white text-amber-900 hover:bg-amber-100">
            <Link href="/contact">Cum ne găsești</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg border-white text-white hover:bg-amber-700">
            <Link href="/about">Despre noi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
