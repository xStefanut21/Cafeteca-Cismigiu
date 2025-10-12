import Image from 'next/image';
import { Users, Coffee, Heart } from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Alexandra Popescu',
      role: 'Fondator & Barista Șef',
      bio: 'Cu peste 10 ani de experiență în industria cafelei de specialitate, Alexandra aduce pasiunea și cunoștințele necesare pentru a crea cele mai delicioase băuturi.',
      image: '/team/alexandra.jpg'
    },
    {
      name: 'Andrei Ionescu',
      role: 'Manager',
      bio: 'Andrei se asigură că fiecare vizită la Cafeteca Cismigiu este una memorabilă, gestionând operațiunile zilnice cu profesionalism și zâmbetul pe buze.',
      image: '/team/andrei.jpg'
    },
    {
      name: 'Elena Dumitrescu',
      role: 'Coafezer',
      bio: 'Specialistă în prepararea deserturilor, Elena creează dulciuri delicioase care se potrivesc perfect cu orice băutură din meniul nostru.',
      image: '/team/elena.jpg'
    }
  ];

  const values = [
    {
      icon: <Coffee className="h-8 w-8 text-amber-700" />,
      title: 'Cafea de Calitate',
      description: 'Lucrăm doar cu boabe de cafea de înaltă calitate, prăjite proaspăt și preparate cu grijă.'
    },
    {
      icon: <Heart className="h-8 w-8 text-amber-700" />,
      title: 'Pasiune',
      description: 'Ne pasă de ceea ce facem și ne străduim să împărtășim această pasiune cu fiecare oaspete.'
    },
    {
      icon: <Users className="h-8 w-8 text-amber-700" />,
      title: 'Comunitate',
      description: 'Suntem mai mult decât o cafenea - suntem o comunitate de iubitori de cafea.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-amber-900 text-white">
        <div className="absolute inset-0 bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-amber-900/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Despre Noi</h1>
          <p className="text-xl text-amber-100 max-w-3xl">
            Cafeteca Cismigiu este mai mult decât o simplă cafenea - este o experiență autentică de cafea în inima Bucureștiului.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl mb-4">Povestea Noastră</h2>
            <div className="mt-6 max-w-4xl mx-auto text-gray-600 text-lg">
              <p className="mb-6">
                Înființată în 2018, Cafeteca Cismigiu a luat naștere din dragostea pentru cafeaua de calitate și dorința de a crea un spațiu primitor unde oamenii să se poată bucura de o cafea excelentă într-un ambient relaxant.
              </p>
              <p className="mb-6">
                Am început ca un mic local ascuns pe o străduță liniștită din centrul vechi, iar astăzi suntem mândri să fim una dintre cele mai iubite cafenele din oraș, cunoscută atât pentru calitatea cafelei, cât și pentru atmosfera primitoare.
              </p>
              <p>
                Ne străduim să fim mai mult decât o simplă cafenea - vrem să fim o parte din viața de zi cu zi a comunității noastre, oferind nu doar cafea, ci și un spațiu unde oamenii se pot întâlni, lucra sau pur și simplu se pot bucura de un moment de liniște.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl mb-4">Valorile Noastre</h2>
            <p className="text-lg text-amber-800 max-w-3xl mx-auto">
              Acestea sunt principiile care ne ghidează în tot ceea ce facem
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center text-amber-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-center">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-amber-900 sm:text-4xl mb-4">Echipa Noastră</h2>
            <p className="text-lg text-amber-800 max-w-3xl mx-auto">
              Cunoașteți echipa pasionată care face posibilă magia din spatele cafelei voastre preferate
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-amber-700 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
