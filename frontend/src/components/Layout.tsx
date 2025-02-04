"use client"

import { PropsWithChildren } from "react";
import { SignedIn, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter()

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      <div className="flex justify-end">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <div className="flex flex-col gap-8 flex-grow">
        <header className="flex flex-col justify-between items-start gap-8">
          <div className="flex w-full justify-between items-end">
            <h1 className="text-4xl font-bold cursor-pointer" onClick={() => router.push('/')}>SmartStock ⚡</h1>
            <p className="text-lg font-light">Enhanced with AI</p>
          </div>
          <hr className="w-full border-t-2 border-[#eee]" />
        </header>
        {children}
      </div>
    </main>
  )
}