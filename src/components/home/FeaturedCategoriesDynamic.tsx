'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import type { HomeSection } from '@/types/home';

export default function FeaturedCategoriesDynamic() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch home sections from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: sectionsData, error: sectionsError } = await supabase
          .from('home_sections')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (sectionsError) throw sectionsError;

        if (sectionsData) {
          setSections(sectionsData);
        }
      } catch (error) {
        console.error('Error fetching home sections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-amber-900 mb-6 tracking-tight leading-tight">
            Descoperă aromele noastre
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
            O selecție deosebită pregătită cu pasiune pentru cei care apreciază adevărata artă a cafelei și deserturilor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-amber-100 hover:border-amber-200"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Image container with overlay */}
              <div className="relative h-64 overflow-hidden">
                {section.image_url ? (
                  <>
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <div className="text-center text-amber-600">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-sm font-medium">Imagine indisponibilă</p>
                    </div>
                  </div>
                )}

                {/* Decorative corner */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl lg:text-3xl font-black text-amber-900 mb-4 group-hover:text-amber-800 transition-colors leading-tight tracking-tight">
                    {section.title}
                  </h3>

                  {/* Description with improved typography */}
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-800 leading-relaxed text-base lg:text-lg font-semibold tracking-wide">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                {section.category ? (
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:via-amber-800 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group/btn"
                  >
                    <Link href={`/menu?category=${section.category}`} className="flex items-center justify-center">
                      <span>{section.link_text || 'Vezi selecția'}</span>
                      <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </Link>
                  </Button>
                ) : section.link_url && section.link_text ? (
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:via-amber-800 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group/btn"
                  >
                    <Link href={section.link_url} className="flex items-center justify-center">
                      <span>{section.link_text}</span>
                      <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </Link>
                  </Button>
                ) : (
                  <div className="w-full h-14 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <span className="text-gray-500 font-medium">Disponibil în curând</span>
                  </div>
                )}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {sections.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-amber-900">
                <p className="text-lg lg:text-xl font-bold mb-1">Vrei să vezi mai multe?</p>
                <p className="text-sm lg:text-base text-gray-700 font-medium">Explorează toată selecția noastră</p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/menu">
                  Vezi meniul complet
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nicio secțiune disponibilă</h3>
              <p className="text-gray-500 mb-6">
                Secțiunile de pe pagina principală vor apărea aici după ce le adaugi în panoul de administrare.
              </p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/admin/home">Adaugă prima secțiune</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
