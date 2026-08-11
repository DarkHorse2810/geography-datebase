import { useState } from "react";
import WorldMap from "./components/WorldMap";
import SearchPanel from "./components/SearchPanel";
import CountryDetailPanel from "./components/CountryDetailPanel";
import "./App.css";

function App() {
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>地理データベース</h1>
        <p>2026 データブック オブ ザ ワールド</p>
      </header>

      <div className="map-area">
        <WorldMap selectedCountryId={selectedCountryId} onSelectCountry={setSelectedCountryId} />
      </div>

      <SearchPanel onSelectCountry={setSelectedCountryId} />

      <CountryDetailPanel countryId={selectedCountryId} onClose={() => setSelectedCountryId(null)} />
    </div>
  );
}

export default App;
