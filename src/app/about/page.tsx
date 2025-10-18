import { Coffee, Heart, Users, Award, Clock, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/coffee-pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-6">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Despre Noi
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-amber-100 mb-2 font-light">
                Specialty coffee. Fresh roast.
              </p>
              <p className="text-lg text-amber-200 font-medium">
                We roast ours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Section */}
          <div className="text-center mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-amber-100 rounded-lg transform rotate-1" />
                  <div className="relative bg-white p-8 rounded-lg shadow-lg">
                    <MapPin className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
                    <h3 className="text-2xl font-bold text-amber-900 mb-4">Unde Ne Găsești</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Cafeteca Cișmigiu s-a deschis în 2023, la doar câțiva pași de Parcul Cișmigiu, pe Bulevardul Regina Elisabeta 61.
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-full h-full bg-amber-100 rounded-lg transform -rotate-1" />
                  <div className="relative bg-white p-8 rounded-lg shadow-lg">
                    <Award className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
                    <h3 className="text-2xl font-bold text-amber-900 mb-4">Rădăcinile Noastre</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Suntem o cafenea cu rădăcini în Brașov, acolo unde ne prăjim singuri cafeaua cu pasiune și dedicare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coffee Selection Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-12 mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-700 rounded-full mb-6">
                <Coffee className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                Selectăm cu Grija
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Boabe Premium</h3>
                <p className="text-gray-600 leading-relaxed">
                  Selectăm boabele direct de la traderi din întreaga lume, alegând doar cele mai bune loturi disponibile.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-amber-900 mb-3">Caracterul Cafelei</h3>
                <p className="text-gray-600 leading-relaxed">
                  Lot cu lot, păstrăm tot ce e esențial: uleiurile esențiale, aromele și caracterul autentic al cafelei.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-700 rounded-full mb-6">
                <span className="text-2xl font-bold text-white">🟠</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
                Povestea Noastră
              </h2>
            </div>

            <div className="relative">
              {/* Timeline design */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 hidden md:block" />

              <div className="space-y-16">
                <div className="relative flex items-center">
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-amber-900 text-white p-6 rounded-lg inline-block">
                      <Clock className="w-8 h-8 mb-2 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">2009 - Începuturile</h3>
                      <p className="text-amber-100">
                        Am început în Brașov cu un espressor, o râșniță și un vis măreț
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full border-4 border-white shadow-lg" />

                  <div className="flex-1" />
                </div>

                <div className="relative flex items-center">
                  <div className="flex-1" />

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-700 rounded-full border-4 border-white shadow-lg" />

                  <div className="flex-1 pl-8">
                    <div className="bg-amber-900 text-white p-6 rounded-lg inline-block">
                      <MapPin className="w-8 h-8 mb-2 mx-auto" />
                      <h3 className="text-xl font-bold mb-2">2023 - București</h3>
                      <p className="text-amber-100">
                        Povestea continuă în inima Bucureștiului, în Cișmigiu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="bg-amber-50 rounded-2xl p-8 max-w-3xl mx-auto">
                <Heart className="w-12 h-12 text-amber-700 mb-4 mx-auto" />
                <p className="text-xl text-gray-700 leading-relaxed">
                  Pentru noi, fiecare origine are un gust, o poveste și un om îndrăgostit de arta cafelei.
                </p>
              </div>
            </div>
          </div>

          {/* Differentiation Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-700 rounded-full mb-6">
                <span className="text-2xl font-bold text-white">🟠</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
                Ce Ne Diferențiază
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Coffee className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Specialty Coffee</h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-center">
                      Cafea de top - proaspăt prăjită și preparată cu grijă.
                    </p>
                    <p className="text-center">
                      Folosim doar boabe atent selecționate, care ajung în ceașca ta pentru o experiență autentică, plină de savoare.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Heart className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Pasiune</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    La Cafeteca Cismigiu, pasiunea noastră pentru cafea se simte în fiecare zi. E bucuria noastră sinceră de a aduce mereu ceva special pentru cei care ne trec pragul.
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center">Responsabilitate și Transparență</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Selectăm cafeaua direct de la traderi, din regiuni cu o tradiție bogată în cultivare, asigurând un parcurs corect „from farm to cup”.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-2xl" />
            <div className="relative text-white p-12 rounded-2xl">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-6 opacity-80" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Spațiu Viu și Comunitate
                </h2>
                <div className="max-w-3xl mx-auto space-y-4 text-lg text-amber-100">
                  <p className="text-amber-100">
                    Cafeteca Cismigiu este un spațiu vibrant unde găzduim:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Workshop-uri</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Recitaluri de poezie</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Ateliere de pictură</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Concerte</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Întâlniri</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">Expoziții</div>
                  </div>
                  <p className="pt-4 text-amber-100">
                    Aici oamenii se conectează, schimbă idei și creează amintiri de neuitat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
