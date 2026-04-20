'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { receiptsApi, type Receipt } from '@/lib/api';

function statusBadge(status: string) {
  const map: Record<string, string> = {
    UPLOADED: 'bg-yellow-100 text-yellow-800',
    OCR_PENDING: 'bg-blue-100 text-blue-800',
    OCR_PROCESSING: 'bg-blue-100 text-blue-800',
    NLP_REFINING: 'bg-indigo-100 text-indigo-800',
    CLASSIFYING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    DELETED: 'bg-gray-100 text-gray-500',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700';
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    receiptsApi
      .list()
      .then(setReceipts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load receipts'),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Receipts</h2>
        <Link
          href="/receipts/upload"
          className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          + Upload
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && receipts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">🧾</span>
          <p className="text-gray-500 font-medium">No receipts yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Tap &ldquo;Upload&rdquo; to scan your first receipt
          </p>
        </div>
      )}

      {!loading && receipts.length > 0 && (
        <ul className="space-y-3">
          {receipts.map((r) => (
            <li key={r.id}>
              <Link
                href={`/receipts/${r.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 hover:border-brand-200 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {r.merchantName ?? 'Unknown merchant'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {r.issuedAt ? new Date(r.issuedAt).toLocaleDateString() : 'Date unknown'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                  {r.totalAmount && (
                    <span className="font-semibold text-sm text-gray-900">
                      {r.totalAmount.currency} {r.totalAmount.amount}
                    </span>
                  )}
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusBadge(r.status)}`}
                  >
                    {r.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
