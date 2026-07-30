export default function ThankYou() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Thanks for buying DSA Vault</h1>
        <p className="mt-4 text-muted-foreground">
          Check your email for a GitHub collaborator invite to the private repository — it&apos;s sent
          automatically within a minute or two of payment. Accept it, then follow the README to get set up.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Didn&apos;t get an invite after a few minutes? Reply to your order confirmation email and it&apos;ll
          be sorted out manually.
        </p>
      </main>
    </div>
  );
}
