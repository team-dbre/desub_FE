import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { href: '/about', label: 'About' },
    { href: '/service', label: 'Service' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/book', label: 'Book a call' },
    { href: '/pricing/subscribe', label: 'Subscribe', className: 'pt-[3.5rem]' },
    ...(isAuthenticated ? [{ href: '/subscription', label: 'My subscription' }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black z-50 text-white overflow-y-auto flex flex-col">
      <div className="flex justify-center items-center py-[3.4rem]">
        <Link href="/" onClick={onClose}>
          <Image
            width={130}
            height={28}
            alt="desub_mobile_menu_logo"
            src="/images/desub_logo_white.png"
          />
        </Link>
      </div>

      <nav className="flex-1 px-[5rem] pt-[5.6rem]">
        <ul className="space-y-[2.7rem] text-[3rem]">
          {menuItems.map(item => (
            <li key={item.href} className={item.className}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`${
                  pathname === item.href ? 'text-primary' : 'text-white hover:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-row justify-between px-[2.4rem] pb-[2.6rem]">
        <button
          className="w-[7.3rem] h-[3.3rem] bg-transparent text-white border border-white rounded-[2rem]"
          onClick={onClose}
        >
          Menu
        </button>
        {!isAuthenticated && (
          <button
            className="w-[7.3rem] h-[3.3rem] bg-transparent text-white border border-white rounded-[2rem]"
            onClick={() => {
              router.push('/login');
              onClose;
            }}
          >
            login
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
