import './globals.css';
import { LangProvider } from '@/context/LangProvider';
import { BookingProvider } from '@/context/BookingProvider';
import { MenuChoiceProvider } from '@/context/MenuChoiceProvider';

export const metadata = {
  title: 'Restaurang Heaven — Churrasco i Uppsala',
  description:
    'Restaurang Heaven — a Brazilian churrasco grill in the heart of Uppsala. Grill buffet, Brazilian-inspired drinks, private dining and conferences.',
  openGraph: {
    title: 'Restaurang Heaven — Churrasco i Uppsala',
    description: 'Brazilian churrasco grill in the heart of Uppsala.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <BookingProvider>
            <MenuChoiceProvider>{children}</MenuChoiceProvider>
          </BookingProvider>
        </LangProvider>
      </body>
    </html>
  );
}
