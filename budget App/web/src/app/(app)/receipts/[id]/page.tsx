// Server component — required for `generateStaticParams` with `output: 'export'`.
// All data fetching is done client-side inside ReceiptDetailClient.

import ReceiptDetailClient from './receipt-detail-client';

// Returns a minimal placeholder so Next.js can generate the shell page.
// All real IDs are resolved client-side via useParams(); this entry is never visited directly.
export function generateStaticParams() {
  return [{ id: '_' }];
}

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReceiptDetailClient id={id} />;
}
