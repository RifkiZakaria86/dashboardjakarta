import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { REGIONS } from '@/lib/regions';

function parseRupiahString(str) {
  if (!str || typeof str !== 'string') return 0;
  // Remove "Rp ", commas, spaces
  const cleaned = str.replace(/Rp\s*/gi, '').replace(/,/g, '').replace(/\./g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function colLetterToIndex(col) {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1; // 0-indexed
}

function getTotalRupiah(region) {
  const dataDir = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDir, region.excelFile);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return 0;
  }

  const workbook = XLSX.readFile(filePath, { cellDates: false, raw: true });

  // Use first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  const colIndex = colLetterToIndex(region.totalRupiahCol);
  let total = 0;
  let headerFound = false;

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;

    const cellVal = row[colIndex];

    // Skip header rows (string values like "Total Rupiah")
    if (typeof cellVal === 'string') {
      const lower = cellVal.toLowerCase();
      if (lower.includes('total') || lower.includes('rupiah') || lower.includes('harsat')) {
        headerFound = true;
        continue;
      }
      // For BOGOR style "Rp 1,767,911,175" strings
      if (cellVal.includes('Rp') || cellVal.includes('rp')) {
        const parsed = parseRupiahString(cellVal);
        if (parsed > 0) total += parsed;
        continue;
      }
      continue;
    }

    if (typeof cellVal === 'number' && cellVal > 0) {
      // Skip obviously wrong values (coordinates, small counts, etc.)
      if (cellVal > 1000) {
        total += cellVal;
      }
    }
  }

  return Math.round(total);
}

export async function GET() {
  try {
    const results = {};

    for (const region of REGIONS) {
      try {
        const total = getTotalRupiah(region);
        results[region.slug] = {
          id: region.id,
          name: region.name,
          slug: region.slug,
          province: region.province,
          totalRupiah: total,
          gasUrl: region.gasUrl,
          color: region.color,
          gradient: region.gradient,
          icon: region.icon,
        };
      } catch (err) {
        console.error(`Error processing ${region.name}:`, err);
        results[region.slug] = {
          id: region.id,
          name: region.name,
          slug: region.slug,
          province: region.province,
          totalRupiah: 0,
          gasUrl: region.gasUrl,
          color: region.color,
          gradient: region.gradient,
          icon: region.icon,
          error: err.message,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
