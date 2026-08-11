# 地理データベース

「2026 データブック オブ ザ ワールド」の内容をもとにした、世界地図から各国のデータを検索できるサイト。

## 開発サーバー起動

```bash
npm install
npm run dev
```

## 構成

- React + Vite + TypeScript
- 地図: `react-simple-maps` + `world-atlas`（国境データ、ズーム/クリック対応）
- 国旗: `country-flag-icons`（ISO alpha-2 コードからSVG国旗を表示）
- データはすべて静的JSONファイル（サーバー不要）

## データの追加方法（書籍からの入力）

国ごとの統計データは `src/data/countryStats/{ISO alpha-3コード}.json` に1ファイルずつ置く。
このフォルダに新しいJSONファイルを追加するだけで、ビルド時に自動的に読み込まれる（`src/data/index.ts` の `import.meta.glob` が拾う）。

国コードは `src/data/countries.json` を参照（例: 日本=JPN, アメリカ=USA）。この一覧は `scripts/generateCountries.mjs` で world-atlas の地図データとISO国名一覧を突き合わせて生成したもの。

### ファイル形式

```json
{
  "id": "JPN",
  "capital": "東京",
  "flagEmoji": "🇯🇵",
  "dataStatus": "sample",
  "overview": "国の概要文（1〜3文程度）",
  "stats": {
    "population": {
      "totalPopulation": { "value": 12435, "unit": "万人", "year": 2023 }
    }
  }
}
```

- `dataStatus`: `"sample"`（仮データ）か `"confirmed"`（書籍から正式入力済み）。書籍の内容を入力し終えたら `"confirmed"` に変更する。
- `stats` の1階層目のキー（`population` など）は `src/data/categories.json` の分類（カテゴリー）ID、2階層目のキー（`totalPopulation` など）はその中の項目IDに対応する。

### カテゴリー・項目を増やす場合

`src/data/categories.json` に新しいカテゴリー/項目を追加する。項目検索（右上パネルの「項目で検索」）は自動的にこの定義を参照するため、追加すればすぐに検索対象になる。

現在サンプルデータが入っているのは日本・アメリカ・中国・インド・ブラジル・ドイツ・オーストラリア・エジプトの8か国のみ（動作確認用）。書籍の約400ページ分のデータを本格的に入力する際は、上記の形式に沿って国ごとにファイルを追加していく。
