'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { receiptsApi } from '@/lib/api';

export default function UploadReceiptPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const receipt = await receiptsApi.upload(formData);
      router.replace(`/receipts/${receipt.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-4 space-y-5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-brand-600 text-sm hover:underline"
      >
        ← Back
      </button>
      <h2 className="text-xl font-bold text-gray-900">Upload Receipt</h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Drop zone / image picker */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors bg-white flex flex-col items-center justify-center py-10 gap-3 text-gray-400"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Receipt preview"
              className="max-h-60 rounded-lg object-contain"
            />
          ) : (
            <>
              <span className="text-4xl">📷</span>
              <span className="text-sm">Tap to choose a photo or file</span>
            </>
          )}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={handleFileChange}
          capture="environment"
        />

        {file && (
          <p className="text-xs text-gray-500 text-center truncate">
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 transition-colors"
        >
          {uploading ? 'Uploading…' : 'Upload Receipt'}
        </button>
      </form>
    </div>
  );
}
