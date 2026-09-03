// Lokasi file di project kamu: components/VisitorCounter.tsx
'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/visitors')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-2xl
                 border border-slate-700/50 bg-slate-900/70 px-4 py-3
                 backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.15)]
                 transition-transform hover:scale-[1.03]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
      </span>

      <div className="leading-tight">
        <p className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-lg font-bold text-transparent">
          {count === null ? '—' : count.toLocaleString('id-ID')}
        </p>
        <p className="text-xs text-slate-400">Visitors today</p>
      </div>
    </div>
  );
}