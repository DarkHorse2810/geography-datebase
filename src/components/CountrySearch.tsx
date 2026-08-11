import { useMemo, useState } from "react";
import { countries } from "../data";
import FlagIcon from "./FlagIcon";

interface CountrySearchProps {
  onSelectCountry: (countryId: string) => void;
}

export default function CountrySearch({ onSelectCountry }: CountrySearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return countries
      .filter(
        (c) =>
          c.nameJa.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [query]);

  return (
    <div className="search-tab">
      <input
        type="text"
        className="search-input"
        placeholder="国名を入力（例: 日本、ブラジル、China）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.trim() !== "" && (
        <ul className="search-results">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="search-result-item"
                onClick={() => {
                  onSelectCountry(c.id);
                  setQuery("");
                }}
              >
                <span className="search-result-main">
                  <FlagIcon alpha2={c.alpha2} className="search-result-flag" />
                  {c.nameJa}
                </span>
                <span className="search-result-sub">{c.nameEn}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="search-no-result">該当する国が見つかりません</li>}
        </ul>
      )}
    </div>
  );
}
