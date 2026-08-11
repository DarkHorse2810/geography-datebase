import { useState } from "react";
import CountrySearch from "./CountrySearch";
import ItemSearch from "./ItemSearch";

interface SearchPanelProps {
  onSelectCountry: (countryId: string) => void;
}

type Tab = "country" | "item";

export default function SearchPanel({ onSelectCountry }: SearchPanelProps) {
  const [tab, setTab] = useState<Tab>("country");

  return (
    <div className="search-panel">
      <div className="search-tabs">
        <button
          type="button"
          className={tab === "country" ? "search-tab-btn active" : "search-tab-btn"}
          onClick={() => setTab("country")}
        >
          国名で検索
        </button>
        <button
          type="button"
          className={tab === "item" ? "search-tab-btn active" : "search-tab-btn"}
          onClick={() => setTab("item")}
        >
          項目で検索
        </button>
      </div>
      {tab === "country" ? (
        <CountrySearch onSelectCountry={onSelectCountry} />
      ) : (
        <ItemSearch onSelectCountry={onSelectCountry} />
      )}
    </div>
  );
}
