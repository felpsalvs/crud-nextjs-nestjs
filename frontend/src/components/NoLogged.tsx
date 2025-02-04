import { SignInButton, } from "@clerk/nextjs";

export const NoLogged = () => (
  <main className="flex items-center justify-center min-h-screen px-4 py-8">
    <div className="text-center max-w-lg">
      <img 
        src="https://opendoodles.s3-us-west-1.amazonaws.com/doggie.gif" 
        alt="Coffee GIF" 
        className="mx-auto mb-4" 
        width="300px"
      />
      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        Welcome to SmartStock ⚡️
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Sign in to unlock the full potential of SmartStock.
      </p>
      <SignInButton mode="modal">
        <button className="px-8 py-2 bg-black text-white rounded hover:bg-[#2979ff] transition">
          Sign In
        </button>
      </SignInButton>
    </div>
  </main>
);