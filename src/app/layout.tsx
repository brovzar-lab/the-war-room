import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'TheWarRoom',
  description: 'CEO Intelligence Command Center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#CBD5E1',
              border: '1px solid #334155',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
