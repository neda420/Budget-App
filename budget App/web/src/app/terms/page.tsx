import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — BudgetLens',
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 text-gray-700">
      <Link href="/" className="text-brand-600 text-sm hover:underline">
        ← Back to app
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: April 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">1. Acceptance</h2>
        <p>
          By creating an account or using BudgetLens you agree to these Terms of Service. If
          you do not agree, please do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">2. Service Description</h2>
        <p>
          BudgetLens is an expense tracking application that allows users to upload receipt
          images for automated data extraction and spending analysis.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">3. Acceptable Use</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Use BudgetLens only for lawful personal or business expense tracking.</li>
          <li>Do not upload content that violates applicable laws or third-party rights.</li>
          <li>Do not attempt to reverse-engineer or disrupt the service.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">4. Subscription Tiers</h2>
        <p>
          BudgetLens offers Free, Pro, and Enterprise tiers. Paid plans are billed monthly or
          annually. You may cancel at any time; no refunds are issued for partial periods.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">5. Disclaimer of Warranties</h2>
        <p>
          BudgetLens is provided &ldquo;as is&rdquo; without warranties of any kind. Extracted
          financial data is for informational purposes only and should not be relied upon as
          authoritative accounting records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, BudgetLens shall not be liable for indirect,
          incidental, or consequential damages arising from your use of the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">7. Contact</h2>
        <p>
          Legal questions?{' '}
          <a href="mailto:legal@budgetlens.app" className="text-brand-600 hover:underline">
            legal@budgetlens.app
          </a>
        </p>
      </section>
    </div>
  );
}
