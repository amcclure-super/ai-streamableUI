import { ReactNode } from 'react';
import { AI } from './actions';

export const dynamic = "force-dynamic";
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AI>{children}</AI>
      </body>
    </html>
  );
}