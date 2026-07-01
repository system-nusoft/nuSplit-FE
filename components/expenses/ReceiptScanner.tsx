"use client";

import React, { useRef, useState, useEffect } from "react";
import { ScanReceiptResult } from "@/types";
import { scanReceiptApi } from "@/lib/services/expenses.service";
import Spinner from "@/components/Spinner";

interface ReceiptScannerProps {
  groupId: string;
  onResult: (result: ScanReceiptResult) => void;
}

export default function ReceiptScanner({ groupId, onResult }: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError("");
    setScanning(true);
    try {
      const result = await scanReceiptApi(groupId, file);
      onResult(result);
    } catch {
      setError("Could not scan receipt. Please try again or fill in manually.");
    } finally {
      setScanning(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="mb-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-indigo-200 rounded-xl p-5 text-center hover:border-indigo-400 transition-colors bg-indigo-50/50"
      >
        {scanning ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Spinner size="md" className="text-indigo-500" />
            <p className="text-sm text-indigo-600 font-medium">Scanning receipt with AI…</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">Scan receipt with AI</p>
            <p className="text-xs text-gray-400 mb-3">Auto-fills description, amount & currency</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Upload image
              </button>
              {isMobile && (
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-xs bg-indigo-600 text-white rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-700 transition-colors"
                >
                  Use camera
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
