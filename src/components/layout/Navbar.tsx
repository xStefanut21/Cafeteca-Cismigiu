'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

const useMousePosition = (elementRef: React.RefObject<HTMLElement | null>) => {
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateDimensions = () => {
      const rect = element.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ 
        x: dimensions.width / 2, 
        y: dimensions.height / 2 
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [dimensions.width, dimensions.height, elementRef]);

  return { mousePosition, isHovered, dimensions };
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const logoRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isHovered } = useMousePosition(logoRef);

  // Calculate transform based on mouse position
  const getContainerTransform = () => {
    if (!logoRef.current || !isHovered) return '';
    
    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate distance from center (normalized to -1 to 1)
    const moveX = ((mousePosition.x - centerX) / centerX) * 8; // 8px max movement
    const moveY = ((mousePosition.y - centerY) / centerY) * 8; // 8px max movement
    
    // Move in the opposite direction of the cursor
    return `translate(${-moveX}px, ${-moveY}px)`;
  };

  const containerTransform = getContainerTransform();

  const navLinks = [
    { name: 'Acasă', href: '/' },
    { name: 'Meniu', href: '/menu' },
    { name: 'Evenimente', href: '/events' },
    { name: 'Despre Noi', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-amber-900/95 shadow-lg' : 'bg-amber-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-3">
            <div 
              ref={logoRef}
              className="relative h-14 w-14 rounded-full overflow-hidden border-3 border-amber-800 shadow-lg group cursor-pointer transition-transform duration-300 ease-out"
              style={{ transform: containerTransform }}
            >
              <div className="relative w-full h-full">
                <div className="w-full h-full">
                  <Image
                    src="/images/logo.jpg"
                    alt="Cafeteca Cismigiu Logo"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-full border-2 border-white/30 mix-blend-overlay" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-amber-900/30 -z-10" />
            </div>
            <Link 
              href="/" 
              className="text-xl font-bold text-white hover:text-amber-200 transition-colors"
            >
              Cafeteca Cismigiu
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-amber-800 text-white'
                    : 'text-amber-100 hover:bg-amber-800/50 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-200 hover:text-white hover:bg-amber-800 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Meniu principal</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-amber-800/95">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-100 hover:bg-amber-700/50 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
