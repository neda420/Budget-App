import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — BudgetLens',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6 text-gray-700">
      <Link href="/" className="text-brand-600 text-sm hover:underline">
        ← Back to app
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: April 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
        <p>
          BudgetLens collects only the information necessary to provide the expense tracking
          service: your email address, receipt images, and the financial data extracted from
          those receipts (merchant names, totals, dates, line items).
        </p>
        <p>
          We do not sell or rent your personal information to third parties. Receipt images are
          processed by our OCR and AI pipeline solely to extract structured data and are stored
          encrypted at rest.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Data</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>To authenticate you and maintain your session.</li>
          <li>To process receipt images and extract expense data.</li>
          <li>To display your spending history and analytics dashboard.</li>
          <li>To send transactional emails (account confirmations, password resets).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">3. Data Retention</h2>
        <p>
          Your data is retained for as long as your account is active. You may request deletion
          of your account and all associated data at any time by contacting{' '}
          <a href="mailto:privacy@budgetlens.app" className="text-brand-600 hover:underline">
            privacy@budgetlens.app
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">4. Security</h2>
        <p>
          All data is transmitted over HTTPS and stored encrypted using AES-256. We follow
          industry-standard practices for access control and secret management.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">5. Third-Party Services</h2>
        <p>
          BudgetLens uses AWS (S3, Textract) for image storage and OCR, and Azure OpenAI for
          NLP categorisation. These services process data under their own privacy policies and
          are contractually bound to handle data securely.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">6. Contact</h2>
        <p>
          Questions about this policy?{' '}
          <a href="mailto:privacy@budgetlens.app" className="text-brand-600 hover:underline">
            privacy@budgetlens.app
          </a>
        </p>
      </section>
    </div>
  );
}
