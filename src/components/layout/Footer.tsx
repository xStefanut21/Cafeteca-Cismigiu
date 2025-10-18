const Footer = () => {
  return (
    <footer className="bg-amber-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2 text-amber-100">Cafeteca Cismigiu</p>
              <p className="mb-2 text-amber-100">Bulevardul Regina Elisabeta 61</p>
              <p className="mb-2 text-amber-100">București, România</p>
              <p className="mb-2">
                <a href="tel:+40748380633" className="hover:underline">
                  +40 748 380 633
                </a>
              </p>
              <p>
                <a
                  href="mailto:cafetecacismigiu@gmail.com"
                  className="hover:underline"
                >
                  cafetecacismigiu@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Luni</span>
                <span>07:30–20:30</span>
              </li>
              <li className="flex justify-between">
                <span>Marți</span>
                <span>07:30–20:30</span>
              </li>
              <li className="flex justify-between">
                <span>Miercuri</span>
                <span>07:30–20:30</span>
              </li>
              <li className="flex justify-between">
                <span>Joi</span>
                <span>07:30–20:30</span>
              </li>
              <li className="flex justify-between">
                <span>Vineri</span>
                <span>07:30–21:30</span>
              </li>
              <li className="flex justify-between">
                <span>Sâmbătă</span>
                <span>08:30–21:30</span>
              </li>
              <li className="flex justify-between">
                <span>Duminică</span>
                <span>08:30–20:30</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link-uri rapide</h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className="hover:underline">Meniu</a>
              </li>
              <li>
                <a href="/events" className="hover:underline">
                  Evenimente
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  Despre Noi
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-amber-800 text-center">
          <p className="text-amber-100">© {new Date().getFullYear()} Cafeteca Cismigiu. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
