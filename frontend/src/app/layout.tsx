import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';
import { Toaster } from "@/components/ui/toaster";
import { ProductsProvider } from "@/domains/products/components/context/ProductsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartStock | Smarter Inventory, Seamless Management",
  description: "Optimize your inventory effortlessly with SmartStock. AI-powered insights, real-time tracking, and seamless product management."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html lang="en">
        <body className={`${inter.className} tracking-[-0.8px]`}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ProductsProvider>
    <SWRConfig value={swrConfig}>
      {children}
      <Toaster />
    </SWRConfig>
  </ProductsProvider>
);