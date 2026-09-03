// Lokasi file di project kamu: app/api/visitors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';

// Tanggal hari ini berdasarkan WIB, ini yang menentukan "reset jam 12 malam"
function getJakartaDateString(): string {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );
  return jakartaTime.toISOString().split('T')[0]; // format YYYY-MM-DD
}

export async function GET(req: NextRequest) {
  const today = getJakartaDateString();
  const key = `visitors:${today}`; // key baru tiap tanggal -> otomatis "reset"

  const cookieStore = await cookies();
  const lastVisit = cookieStore.get('last_visit_date')?.value;

  let count: number;

  if (lastVisit === today) {
    // Sudah dihitung hari ini (misal reload halaman) -> cuma ambil angka, tidak nambah
    count = (await kv.get<number>(key)) ?? 0;
  } else {
    // Kunjungan baru untuk hari ini -> increment atomik
    count = await kv.incr(key);
    // key otomatis kadaluarsa 2 hari kemudian, biar tidak numpuk key lama selamanya
    await kv.expire(key, 60 * 60 * 24 * 2);
  }

  const response = NextResponse.json({ count, date: today });
  response.cookies.set('last_visit_date', today, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 hari
  });

  return response;
}