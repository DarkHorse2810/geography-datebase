import type { CategoryDef, CountryMeta, CountryStats } from "../types";
import countriesJson from "./countries.json";
import categoriesJson from "./categories.json";

export const countries = countriesJson as CountryMeta[];
export const categories = categoriesJson as CategoryDef[];

// countryStats/ 配下に {ISO alpha-3}.json を置くだけで自動的に読み込まれる。
// 書籍からのデータ入力時はこのフォルダにファイルを追加していけばよい。
const statsModules = import.meta.glob("./countryStats/*.json", { eager: true }) as Record<
  string,
  { default: CountryStats }
>;

export const countryStatsMap: Record<string, CountryStats> = {};
for (const path in statsModules) {
  const stats = statsModules[path].default;
  countryStatsMap[stats.id] = stats;
}

export const countryMetaMap: Record<string, CountryMeta> = Object.fromEntries(
  countries.map((c) => [c.id, c]),
);

// world-atlas topojson の feature.id (numericId) から CountryMeta を引くための索引
export const countryByNumericId: Record<string, CountryMeta> = Object.fromEntries(
  countries.map((c) => [String(c.numericId), c]),
);

export function getCategory(categoryId: string): CategoryDef | undefined {
  return categories.find((c) => c.id === categoryId);
}
