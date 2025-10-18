import { Metadata } from 'next';
import { Map } from '@/components/contact/Map';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Coffee } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - Cafeteca Cismigiu',
  description: 'Contactați-ne pentru orice întrebări sau rezervări. Suntem aici pentru a vă ajuta!',
};

export default function ContactPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Aveți întrebări sau doriți să faceți o rezervare?
            </h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Suntem aici pentru dumneavoastră.<br />
              Contactați-ne folosind informațiile de mai jos.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Date de contact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Găsiți-ne ușor în centrul Bucureștiului și luați legătura cu noi pentru orice întrebare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Address Card */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Adresă</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Bulevardul Regina Elisabeta 61<br />
                București, România
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Phone className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Telefon</h3>
              <a href="tel:+40748380633" className="text-gray-600 hover:text-amber-700 transition-colors text-center block">
                +40 748 380 633
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Email</h3>
              <a
                href="mailto:cafetecacismigiu@gmail.com"
                className="text-gray-600 hover:text-amber-700 transition-colors text-center block break-words"
              >
                cafetecacismigiu@gmail.com
              </a>
            </div>
          </div>

          {/* Hours Card */}
          <div className="group">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">Program</h3>
              <div className="text-gray-600 text-sm space-y-1 text-center">
                <div className="flex justify-between">
                  <span>Luni - Joi:</span>
                  <span>07:30–20:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Vineri:</span>
                  <span>07:30–21:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Sâmbătă:</span>
                  <span>08:30–21:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Duminică:</span>
                  <span>08:30–20:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-8">Urmărește-ne</h3>
          <div className="flex justify-center space-x-8">
            <a
              href="https://www.tiktok.com/@cafeteca_cismigiu"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.26 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors">TikTok</span>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100091223502785"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Facebook className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors">Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/cafeteca_cismigiu/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-700 rounded-full mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Ne găsiți direct în inima Bucureștiului.</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-100">
            <Map />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Te așteptăm să ne vizitezi chiar astăzi!
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
            La Cafeteca nu vii doar pentru cafea, vii pentru o experiență completă.
            Arome din cele mai exotice colțuri ale lumii, o atmosferă cozy și un vibe pe care vrei să-l iei cu tine acasă.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-amber-900 bg-white hover:bg-amber-50 transition-colors"
            >
              Vezi meniul
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-amber-800 transition-colors"
            >
              Despre noi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
