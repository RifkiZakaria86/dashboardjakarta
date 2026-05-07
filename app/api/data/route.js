import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { REGIONS } from '../../../lib/regions';

// Parse string "Rp 1,767,911,175" → number
function parseRupiahString(str) {
  if (!str || typeof str !== 'string') return 0;
  const cleaned = str.replace(/Rp\s*/gi, '').replace(/\./g, '').replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Cek apakah baris adalah baris TOTAL/SUBTOTAL (harus di-skip)
function isTotalRow(row) {
  const keywords = ['total', 'jumlah', 'grand', 'sub total', 'rekapitulasi', 'subtotal'];
  for (let i = 0; i < Math.min(5, row.length); i++) {
    const v = String(row[i] || '').toLowerCase().trim();
    if (keywords.some(k => v.includes(k))) return true;
  }
  return false;
}

// Option B: Fetch live dari GAS (?action=getTotal)
async function fetchTotalFromGAS(region) {
  try {
    const url = `${region.gasUrl}?action=getTotal`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) return null;
    const json = await res.json();
    if (json.success && typeof json.total === 'number' && json.total > 0) {
      console.log(`[GAS] ${region.name}: Rp ${json.total.toLocaleString('id-ID')}`);
      return json.total;
    }
    return null;
  } catch { return null; }
}

// Fallback: Sum kolom Total Rupiah langsung dari Excel
// (sudah dihitung di sheet = (stock+titipan)*harSat, sama dgn rumus GAS)
function calcFromExcel(region) {
  const filePath = path.join(process.cwd(), 'data', region.excelFile);
  if (!fs.existsSync(filePath)) return 0;

  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: 'buffer', raw: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: true });

  const { totalRupiahCol, rupiahIsString } = region;
  let total = 0;

  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(v => v === null)) continue;
    if (isTotalRow(row)) continue;

    const cell = row[totalRupiahCol];

    if (rupiahIsString) {
      if (typeof cell === 'string' && cell.toLowerCase().includes('rp')) {
        const v = parseRupiahString(cell);
        if (v > 0) total += v;
      } else if (typeof cell === 'number' && cell > 0) {
        total += cell;
      }
    } else {
      if (typeof cell === 'number' && cell > 0) total += cell;
    }
  }

  return Math.round(total);
}

export async function GET() {
  try {
    const entries = await Promise.all(
      REGIONS.map(async (region) => {
        let totalRupiah = 0;
        let source = 'excel';

        const gasTotal = await fetchTotalFromGAS(region);
        if (gasTotal !== null) {
          totalRupiah = gasTotal;
          source = 'gas';
        } else {
          try { totalRupiah = calcFromExcel(region); } catch (e) {
            console.error(`[EXCEL] ${region.name}:`, e.message);
          }
        }

        console.log(`[API] ${region.name} (${source}): Rp ${totalRupiah.toLocaleString('id-ID')}`);
        return [region.slug, {
          id: region.id, name: region.name, slug: region.slug,
          province: region.province, totalRupiah, source,
          gasUrl: region.gasUrl, color: region.color,
          gradient: region.gradient, icon: region.icon,
        }];
      })
    );

    return NextResponse.json({ success: true, data: Object.fromEntries(entries), updatedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
