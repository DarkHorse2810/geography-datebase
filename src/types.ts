// データベース全体で共有する型定義

export interface CategoryItemDef {
  id: string;
  nameJa: string;
  unit?: string;
}

export interface CategoryDef {
  id: string;
  nameJa: string;
  items: CategoryItemDef[];
}

// src/data/countries.json の1件（scripts/generateCountries.mjs が生成）
export interface CountryMeta {
  id: string; // 主キー: ISO alpha-3（無ければ仮ID、例: XKX）
  numericId: string; // world-atlas topojson の feature.id と対応
  alpha2: string | null;
  nameJa: string;
  nameEn: string;
  mapName: string; // 地図データ内での表記
}

export interface StatValue {
  value: number | string;
  unit?: string;
  year?: number;
  rank?: number; // 世界順位（分かる場合）
  source?: string;
}

// src/data/countryStats/{id}.json の中身
export interface CountryStats {
  id: string; // CountryMeta.id と対応
  capital?: string;
  overview?: string;
  flagEmoji?: string;
  dataStatus: "sample" | "confirmed"; // sample = 書籍からの正式入力待ちの仮データ
  stats: {
    [categoryId: string]: {
      [itemId: string]: StatValue;
    };
  };
}
