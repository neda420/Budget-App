'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { receiptsApi, type Receipt } from '@/lib/api';

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium">{value}</span>
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  UPLOADED: 'text-yellow-700 bg-yellow-50',
  OCR_PENDING: 'text-blue-700 bg-blue-50',
  OCR_PROCESSING: 'text-blue-700 bg-blue-50',
  NLP_REFINING: 'text-indigo-700 bg-indigo-50',
  CLASSIFYING: 'text-purple-700 bg-purple-50',
  COMPLETED: 'text-green-700 bg-green-50',
  FAILED: 'text-red-700 bg-red-50',
  DELETED: 'text-gray-500 bg-gray-50',
};

export default function ReceiptDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    receiptsApi
      .get(id)
      .then(setReceipt)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load receipt'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!id || !confirm('Delete this receipt? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await receiptsApi.delete(id);
      router.replace('/receipts');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete receipt');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500 text-sm">{error}</p>;
  }

  if (!receipt) return null;

  const colorClass = STATUS_COLOR[receipt.status] ?? 'text-gray-700 bg-gray-50';

  return (
    <div className="p-4 space-y-5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-brand-600 text-sm hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`px-4 py-3 flex items-center justify-between ${colorClass}`}>
          <span className="font-semibold text-sm">{receipt.status.replace(/_/g, ' ')}</span>
        </div>
        <div className="px-4">
          <DetailRow label="Merchant" value={receipt.merchantName} />
          <DetailRow
            label="Total"
            value={
              receipt.totalAmount
                ? `${receipt.totalAmount.currency} ${receipt.totalAmount.amount}`
                : undefined
            }
          />
          <DetailRow
            label="Date"
            value={receipt.issuedAt ? new Date(receipt.issuedAt).toLocaleDateString() : undefined}
          />
          <DetailRow label="Receipt ID" value={receipt.id} />
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-full rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 font-medium py-3 text-sm transition-colors"
      >
        {deleting ? 'Deleting…' : 'Delete Receipt'}
      </button>
    </div>
  );
}
