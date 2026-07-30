import { cookies } from "next/headers";
import { GITHUB_AUTH_COOKIE, verifyCookieValue } from "@/lib/auth-cookie";

const FEATURES = [
  {
    title: "Learning Intuition chat",
    body: "State your own approach first. A Socratic coach reacts, nudges, and asks clarifying questions before you ever see the write-up.",
  },
  {
    title: "Convert to any language",
    body: "Python, JavaScript, TypeScript, C++, C, Go, Rust, or Kotlin — each saved as a real, runnable file you can open in an editor.",
  },
  {
    title: "Practice & get graded",
    body: "Write your own attempt in your chosen language and get a verdict, score, issues, fixes, and complexity feedback.",
  },
  {
    title: "Visual dry runs",
    body: "A step-by-step, AI-generated visualization of an example run for any algorithm, rendered safely in a sandboxed frame.",
  },
];

const ERROR_MESSAGES: Record<string, string> = {
  oauth_state_mismatch: "GitHub sign-in failed a security check — please try connecting again.",
  oauth_token_exchange_failed: "Could not complete GitHub sign-in — please try again.",
  oauth_user_fetch_failed: "Could not read your GitHub profile — please try again.",
  oauth_unexpected_error: "Something went wrong during GitHub sign-in — please try again.",
  not_signed_in: "Please connect GitHub before buying.",
  payment_link_failed: "Could not start checkout — please try again in a moment.",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const githubUsername = verifyCookieValue(cookieStore.get(GITHUB_AUTH_COOKIE)?.value);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight">DSA Vault</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          An AI-assisted DSA interview trainer built on the Striver&apos;s A2Z DSA Sheet — chat with a coach
          about your own intuition before seeing the write-up, convert solutions to any language, get your
          practice attempts graded, and generate a visual step-by-step dry run of any algorithm.
        </p>

        <div className="mt-8 rounded-md border border-yellow-600/40 bg-yellow-600/10 p-4 text-sm">
          <strong>Before you buy:</strong> this requires your own Claude Pro, Max, or Code login. Every AI
          feature runs through <em>your</em> logged-in <code>claude</code> CLI — this product is the tool
          and workflow, not AI usage or API access.
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="rounded-md border p-4">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-md border p-6">
          <h2 className="text-xl font-semibold">Get lifetime access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            One-time purchase. You&apos;re added as a collaborator on the private repository and can{" "}
            <code>git pull</code> for every future update.
          </p>

          {error ? (
            <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {ERROR_MESSAGES[error] ?? "Something went wrong — please try again."}
            </p>
          ) : null}

          <div className="mt-6">
            {githubUsername ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Signed in as <strong>@{githubUsername}</strong>
                </p>
                <a
                  href="/api/create-payment-link"
                  className="inline-flex h-11 w-fit items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Buy Now
                </a>
              </div>
            ) : (
              <a
                href="/api/auth/github/start"
                className="inline-flex h-11 w-fit items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Connect GitHub to continue
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
