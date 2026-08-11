import { categories, countryMetaMap, countryStatsMap } from "../data";
import FlagIcon from "./FlagIcon";

interface CountryDetailPanelProps {
  countryId: string | null;
  onClose: () => void;
}

export default function CountryDetailPanel({ countryId, onClose }: CountryDetailPanelProps) {
  if (!countryId) return null;
  const meta = countryMetaMap[countryId];
  const stats = countryStatsMap[countryId];

  if (!meta) return null;

  return (
    <div className="detail-panel">
      <button type="button" className="detail-close" onClick={onClose} aria-label="閉じる">
        ×
      </button>
      <div className="detail-header">
        <FlagIcon alpha2={meta.alpha2} className="detail-flag" />
        <div>
          <h2>{meta.nameJa}</h2>
          <p className="detail-subtitle">{meta.nameEn}</p>
        </div>
      </div>

      {!stats ? (
        <p className="detail-no-data">
          この国のデータはまだ登録されていません。書籍からのデータ入力後に表示されます。
        </p>
      ) : (
        <>
          {stats.dataStatus === "sample" && (
            <p className="detail-badge-sample">※ サンプルデータ（書籍からの正式入力待ち）</p>
          )}
          {stats.capital && (
            <p className="detail-capital">首都: {stats.capital}</p>
          )}
          {stats.overview && <p className="detail-overview">{stats.overview}</p>}

          {categories.map((category) => {
            const items = stats.stats[category.id];
            if (!items) return null;
            const entries = category.items
              .map((itemDef) => ({ itemDef, stat: items[itemDef.id] }))
              .filter((e) => e.stat);
            if (entries.length === 0) return null;
            return (
              <div key={category.id} className="detail-category">
                <h3>{category.nameJa}</h3>
                <table className="detail-stat-table">
                  <tbody>
                    {entries.map(({ itemDef, stat }) => (
                      <tr key={itemDef.id}>
                        <td>{itemDef.nameJa}</td>
                        <td className="detail-stat-value">
                          {stat.value}
                          {stat.unit ? ` ${stat.unit}` : ""}
                        </td>
                        <td className="detail-stat-year">{stat.year ? `${stat.year}年` : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
