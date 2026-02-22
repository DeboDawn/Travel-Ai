import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WanderWise',
  description: 'Your AI-powered travel companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isGeminiApiKeyMissing = !process.env.GEMINI_API_KEY;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
        <SidebarProvider>
          <Sidebar>
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            {isGeminiApiKeyMissing && (
              <div className="container mx-auto px-4 pt-8">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Set up your Gemini API Key</AlertTitle>
                  <AlertDescription>
                    To use the generative AI features of this app, you&apos;ll need a Gemini API key.
                    <ol className="list-decimal list-inside mt-2 space-y-2">
                      <li>
                        Get your key from{' '}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium"
                        >
                          Google AI Studio
                        </a>.
                      </li>
                      <li>
                        Create a file named <code>.env</code> in the project root.
                      </li>
                      <li>
                        Add your key to the file:
                        <pre className="mt-2 p-2 bg-muted rounded-md text-xs font-mono">
                          GEMINI_API_KEY=YOUR_API_KEY_HERE
                        </pre>
                      </li>
                      <li>
                        Restart the development server for changes to take effect.
                      </li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            {children}
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
