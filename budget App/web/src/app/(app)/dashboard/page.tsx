'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { receiptsApi, type Receipt } from '@/lib/api';

interface Stats {
  totalReceipts: number;
  pendingReceipts: number;
  completedReceipts: number;
}

function computeStats(receipts: Receipt[]): Stats {
  return {
    totalReceipts: receipts.length,
    pendingReceipts: receipts.filter(
      (r) => r.status !== 'COMPLETED' && r.status !== 'FAILED' && r.status !== 'DELETED',
    ).length,
    completedReceipts: receipts.filter((r) => r.status === 'COMPLETED').length,
  };
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-brand-700 mt-1">{value}</p>
    </div>
  );
}

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

export default function DashboardPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    receiptsApi
      .list()
      .then(setReceipts)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load data'),
      )
      .finally(() => setLoading(false));
  }, []);

  const stats = computeStats(receipts);
  const recent = receipts.slice(0, 5);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={stats.totalReceipts} />
        <StatCard label="Processing" value={stats.pendingReceipts} />
        <StatCard label="Done" value={stats.completedReceipts} />
      </div>

      {/* Quick upload */}
      <Link
        href="/receipts/upload"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 transition-colors"
      >
        <span className="text-lg">📷</span> Scan a Receipt
      </Link>

      {/* Recent receipts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Recent Receipts</h3>
          <Link href="/receipts" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {!loading && !error && recent.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No receipts yet — tap &ldquo;Scan a Receipt&rdquo; to get started!
          </p>
        )}

        {!loading && recent.length > 0 && (
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/receipts/${r.id}`}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 hover:border-brand-200 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {r.merchantName ?? 'Unknown merchant'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.issuedAt ? new Date(r.issuedAt).toLocaleDateString() : 'Date unknown'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {r.totalAmount && (
                      <span className="font-semibold text-sm text-gray-900">
                        {r.totalAmount.currency} {r.totalAmount.amount}
                      </span>
                    )}
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusBadge(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
