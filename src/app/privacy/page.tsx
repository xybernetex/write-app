import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — The Writing Gym",
  description: "How The Writing Gym collects, uses, and protects your data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-zinc-100 mb-4">{title}</h2>
      <div className="space-y-3 text-zinc-400 leading-relaxed text-sm">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-8 py-16">

        <div className="mb-8">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← The Writing Gym
          </Link>
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Legal</div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-12">Effective date: May 18, 2026</p>

        <p className="text-zinc-400 leading-relaxed text-sm mb-10">
          The Writing Gym (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates writegym.com. This policy explains what data we collect when you use the service, how we use it, and what choices you have. We collect only what we need to run the product.
        </p>

        <Section title="1. What We Collect">
          <p><strong className="text-zinc-200">Account data.</strong> When you create an account, we collect your email address and, if you choose to provide it, your name. This is handled through Clerk (our authentication provider) and stored securely on their infrastructure.</p>
          <p><strong className="text-zinc-200">Writing submissions.</strong> When you submit a response to an exercise, we store the text you wrote, the exercise it was submitted to, your score, the AI feedback, and whether you passed. We use this to show you your history and to improve the quality of the curriculum.</p>
          <p><strong className="text-zinc-200">Progress and activity data.</strong> We store which exercises you&apos;ve completed, your best scores, your XP total, and your current streak. This is what powers your progress tracking.</p>
          <p><strong className="text-zinc-200">Usage data.</strong> We collect basic aggregate data about how the product is used (pass rates, submission counts, criteria failure rates). This data is not linked to personally identifiable information in our analytics views.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>We use the data we collect to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Provide and operate the service</li>
            <li>Remember your progress and history</li>
            <li>Send your writing to our AI provider for scoring and feedback (see Third-Party Services below)</li>
            <li>Understand how the curriculum is performing so we can improve it</li>
            <li>Send you account-related emails (password resets, verification)</li>
          </ul>
          <p>We do not sell your data. We do not use your writing submissions to train AI models. We do not send you marketing email unless you explicitly opt in.</p>
        </Section>

        <Section title="3. Third-Party Services">
          <p>Running this product requires sharing certain data with third-party providers. Here is who they are and what they receive:</p>

          <div className="space-y-4 mt-2">
            <div>
              <p className="font-medium text-zinc-200">Clerk (clerk.com)</p>
              <p>Handles authentication. Stores your email address and any profile information you provide. Clerk is SOC 2 Type II certified. Their privacy policy is at clerk.com/legal/privacy.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">Cloudflare Workers AI</p>
              <p>When you submit a writing exercise, the text of your submission and the exercise prompt are sent to Cloudflare&apos;s AI API for scoring and feedback generation. Cloudflare processes this data to return a response and does not retain it for model training. Their privacy policy is at cloudflare.com/privacypolicy.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">LanguageTool (languagetool.org)</p>
              <p>As you write, your text is sent to the LanguageTool public API for grammar and style checking. This happens in real time as you type (with a short delay). LanguageTool&apos;s privacy policy is at languagetool.org/legal/privacy.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-200">DigitalOcean</p>
              <p>Our servers and database are hosted on DigitalOcean infrastructure in the United States. Your data is stored on encrypted managed database instances.</p>
            </div>
          </div>
        </Section>

        <Section title="4. Cookies and Local Storage">
          <p>We use cookies for one purpose: to keep you signed in. These are authentication cookies set by Clerk. They are strictly necessary for the service to function.</p>
          <p>We use your browser&apos;s local storage to remember that you have dismissed the cookie notice. No tracking cookies are set. No advertising cookies are set.</p>
          <p>You can block cookies in your browser settings. Blocking authentication cookies will prevent you from signing in.</p>
        </Section>

        <Section title="5. Data Retention">
          <p>We retain your account data and submission history for as long as your account is active. If you delete your account, we will delete your personal data within 30 days. Aggregate, non-identifiable analytics data may be retained indefinitely.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on where you live, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-zinc-200">Access.</strong> You can request a copy of the personal data we hold about you.</li>
            <li><strong className="text-zinc-200">Correction.</strong> You can request that we correct inaccurate data.</li>
            <li><strong className="text-zinc-200">Deletion.</strong> You can request that we delete your account and associated data.</li>
            <li><strong className="text-zinc-200">Portability.</strong> You can request your submission history in a machine-readable format.</li>
            <li><strong className="text-zinc-200">Objection.</strong> You can object to how we process your data.</li>
          </ul>
          <p>To exercise any of these rights, email us at the address in the Contact section below. We will respond within 30 days.</p>
          <p>If you are in the European Economic Area, you also have the right to lodge a complaint with your local data protection authority.</p>
        </Section>

        <Section title="7. Children">
          <p>The Writing Gym is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has created an account, please contact us and we will delete it.</p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>We may update this policy from time to time. If we make material changes, we will update the effective date at the top of this page. Continued use of the service after changes are posted constitutes your acceptance of the updated policy.</p>
        </Section>

        <Section title="9. Contact">
          <p>If you have questions about this policy or want to exercise your data rights, contact us at:</p>
          <p className="mt-2">
            <a href="mailto:support@writegym.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              support@writegym.com
            </a>
          </p>
        </Section>

        <div className="border-t border-zinc-800 pt-8 mt-4">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to The Writing Gym
          </Link>
        </div>

      </div>
    </main>
  );
}
