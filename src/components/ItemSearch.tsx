import { useMemo, useState } from "react";
import { categories, countries, countryStatsMap } from "../data";
import DataTable, { type DataTableColumn } from "./DataTable";

interface ItemSearchProps {
  onSelectCountry: (countryId: string) => void;
}

interface ResultRow {
  countryId: string;
  nameJa: string;
  value: number | string;
  unit?: string;
  year?: number;
}

export default function ItemSearch({ onSelectCountry }: ItemSearchProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const category = categories.find((c) => c.id === categoryId);
  const [itemId, setItemId] = useState(category?.items[0]?.id ?? "");

  const currentCategory = categories.find((c) => c.id === categoryId);
  const currentItem = currentCategory?.items.find((i) => i.id === itemId);

  const rows: ResultRow[] = useMemo(() => {
    if (!categoryId || !itemId) return [];
    const result: ResultRow[] = [];
    for (const country of countries) {
      const stat = countryStatsMap[country.id]?.stats?.[categoryId]?.[itemId];
      if (!stat) continue;
      result.push({
        countryId: country.id,
        nameJa: country.nameJa,
        value: stat.value,
        unit: stat.unit,
        year: stat.year,
      });
    }
    return result;
  }, [categoryId, itemId]);

  const columns: DataTableColumn<ResultRow>[] = [
    { key: "nameJa", header: "国名", accessor: (r) => r.nameJa },
    {
      key: "value",
      header: `値${currentItem?.unit ? `（${currentItem.unit}）` : ""}`,
      accessor: (r) => r.value,
      align: "right",
    },
    { key: "year", header: "年", accessor: (r) => r.year ?? "-", align: "right" },
  ];

  function handleCategoryChange(newCategoryId: string) {
    setCategoryId(newCategoryId);
    const newCategory = categories.find((c) => c.id === newCategoryId);
    setItemId(newCategory?.items[0]?.id ?? "");
  }

  return (
    <div className="search-tab">
      <div className="item-search-selects">
        <select value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameJa}
            </option>
          ))}
        </select>
        <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {(category?.items ?? []).map((i) => (
            <option key={i.id} value={i.id}>
              {i.nameJa}
            </option>
          ))}
        </select>
      </div>
      <div className="item-search-result">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.countryId}
          defaultSortKey="value"
          defaultSortDir="desc"
          onRowClick={(r) => onSelectCountry(r.countryId)}
        />
      </div>
    </div>
  );
}
