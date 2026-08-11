// 世界地図(world-atlas)に含まれる国と、ISO 3166名称(日本語/英語)を突き合わせて
// src/data/countries.json を生成するビルド補助スクリプト。
// 実行: node scripts/generateCountries.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as topojsonClient from "topojson-client";
import countries from "i18n-iso-countries";
import ja from "i18n-iso-countries/langs/ja.json" with { type: "json" };
import en from "i18n-iso-countries/langs/en.json" with { type: "json" };

countries.registerLocale(ja);
countries.registerLocale(en);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topoPath = path.join(__dirname, "../node_modules/world-atlas/countries-110m.json");
const topology = JSON.parse(readFileSync(topoPath, "utf-8"));
const geo = topojsonClient.feature(topology, topology.objects.countries);

// 地図データ側の名前だけで表記が異なる/ISO数値コードを持たない係争地域・未承認国向けの補完
const manualByName = {
  Kosovo: { id: "XKX", nameJa: "コソボ", nameEn: "Kosovo" },
  "N. Cyprus": { id: "XNC", nameJa: "北キプロス", nameEn: "Northern Cyprus" },
  Somaliland: { id: "XSO", nameJa: "ソマリランド", nameEn: "Somaliland" },
};

const result = [];
for (const f of geo.features) {
  const mapName = f.properties.name;
  const rawId = Number(f.id);
  const hasNumeric = Number.isFinite(rawId) && rawId >= 0;
  const numericId = hasNumeric ? String(rawId).padStart(3, "0") : null;
  const alpha2 = numericId ? countries.numericToAlpha2(numericId) : null;
  const alpha3 = numericId ? countries.numericToAlpha3(numericId) : null;
  const manual = manualByName[mapName];

  const nameJa = (numericId && countries.getName(numericId, "ja")) ?? manual?.nameJa ?? mapName;
  const nameEn = (numericId && countries.getName(numericId, "en")) ?? manual?.nameEn ?? mapName;

  result.push({
    id: alpha3 ?? manual?.id ?? `X${mapName.replace(/\s+/g, "")}`, // 主キー: ISO alpha-3 (無ければ仮ID)
    numericId: f.id, // topojson feature.id と突き合わせるための元の値
    alpha2: alpha2 ?? null,
    nameJa,
    nameEn,
    mapName,
  });
}

result.sort((a, b) => a.nameJa.localeCompare(b.nameJa, "ja"));

const outPath = path.join(__dirname, "../src/data/countries.json");
writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n", "utf-8");
console.log(`Wrote ${result.length} countries to ${outPath}`);
