import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

type Row = {
  id?: string;
  name: string;
  address: string;
  totalSpots: number;
  pricePerHour: number;
  latitude: number;
  longitude: number;
};

const round = (n: number) => Math.round(n * 1e6) / 1e6;
const keyOf = (lat: number, lng: number) => `${round(lat)},${round(lng)}`;
const isGeneric = (name: string) => /^Parking Marrakech \d+$/i.test(name.trim());

const rows = new Map<string, Row>();

function add(row: Row) {
  const key = keyOf(row.latitude, row.longitude);
  const existing = rows.get(key);
  if (!existing) {
    rows.set(key, row);
    return;
  }
  if (isGeneric(existing.name) && !isGeneric(row.name)) {
    existing.name = row.name;
  }
}

const root = process.cwd();

// 1) insert_parkings.sql
const sql = fs.readFileSync(path.join(root, "insert_parkings.sql"), "utf8");
const valuesRe =
  /VALUES \(\x27([^\x27]*)\x27, \x27([^\x27]*)\x27, \x27([^\x27]*)\x27, (\d+), ([\d.]+), ([-\d.]+), ([-\d.]+)\)/g;
for (const m of sql.matchAll(valuesRe)) {
  add({
    id: m[1],
    name: m[2],
    address: m[3],
    totalSpots: Number(m[4]),
    pricePerHour: Number(m[5]),
    latitude: Number(m[6]),
    longitude: Number(m[7]),
  });
}

// 2) marrakech_parkings_clean.csv
const csv = fs.readFileSync(path.join(root, "marrakech_parkings_clean.csv"), "utf8");
const lines = csv.trim().split(/\r?\n/);
for (const line of lines.slice(1)) {
  const p = line.split(",");
  if (p.length !== 7) continue;
  add({
    id: p[0],
    name: p[1],
    address: p[2],
    totalSpots: Number(p[3]),
    pricePerHour: Number(p[4]),
    latitude: Number(p[5]),
    longitude: Number(p[6]),
  });
}

// 3) database.geojson (used to fill names / catch any extra location)
const geo = JSON.parse(fs.readFileSync(path.join(root, "database.geojson"), "utf8"));
for (const f of geo.features) {
  const c = f.geometry.coordinates;
  let lat: number;
  let lng: number;
  if (f.geometry.type === "Point") {
    lng = c[0];
    lat = c[1];
  } else {
    const ring: number[][] = c[0];
    lng = ring.reduce((a, p) => a + p[0], 0) / ring.length;
    lat = ring.reduce((a, p) => a + p[1], 0) / ring.length;
  }
  add({
    name: f.properties.name ?? `Parking Marrakech ${rows.size + 1}`,
    address: "Marrakech",
    totalSpots: 50,
    pricePerHour: 5,
    latitude: lat,
    longitude: lng,
  });
}

async function main() {
  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const existing = await prisma.parking.findMany({
      select: { latitude: true, longitude: true },
    });
    const existingKeys = new Set(
      existing
        .filter((p) => p.latitude !== null && p.longitude !== null)
        .map((p) => keyOf(p.latitude as number, p.longitude as number))
    );

    const toInsert = [...rows.values()].filter(
      (r) => !existingKeys.has(keyOf(r.latitude, r.longitude))
    );

    if (toInsert.length > 0) {
      await prisma.parking.createMany({ data: toInsert });
    }

    console.log(`Unique parkings found in files: ${rows.size}`);
    console.log(`Already in database: ${existing.length}`);
    console.log(`Inserted now: ${toInsert.length}`);
    console.log(`Skipped (duplicates): ${rows.size - toInsert.length}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
