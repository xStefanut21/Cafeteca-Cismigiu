'use client';

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
}

export function Map() {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.9354612523657!2d26.087941676046118!3d44.43448607107569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ffb6b4a97ab5%3A0x7ea2b4cefb3f00f8!2sCafeteca%20Cismigiu!5e0!3m2!1sen!2sro!4v1760464860731!5m2!1sen!2sro"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Cafeteca Cismigiu Location"
      />
    </div>
  );
}
