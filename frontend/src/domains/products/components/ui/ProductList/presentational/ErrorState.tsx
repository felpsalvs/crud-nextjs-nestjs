export function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center p-6 py-[40px]">
      <img src="/images/errorState.png" alt="Error" className="w-64 mb-4" />
      <p className="text-xl font-semibold text-center">
        Our servers are taking a coffee break! <br />
        Refresh or try again later.
      </p>
    </div>
  );
}

