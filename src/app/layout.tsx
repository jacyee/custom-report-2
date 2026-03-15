import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: 'Custom Report Generator',
  description: 'Configure API endpoints, map fields, and generate reports',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <ToastProvider>
          <nav className="border-b border-zinc-800 bg-zinc-900">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <a href="/" className="font-bold text-lg text-zinc-100 hover:text-zinc-300 transition-colors">
                Report Generator
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="/schedule-groups/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-100 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  + New Report Schedule Group
                </a>
                <a
                  href="/customers/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-100 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  + New Customer
                </a>
                <a
                  href="/reports/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  + New Report
                </a>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
