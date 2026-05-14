import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'TheWarRoom — Intelligence Brief',
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
              background: '#1a1a1a',
              color: '#f0f0f0',
              border: '1px solid #2e2e2e',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
            },
          }}
        />
      </body>
    </html>
  );
}
