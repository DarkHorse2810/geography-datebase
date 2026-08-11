import { useMemo, useRef, useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import * as topojsonClient from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import worldTopology from "world-atlas/countries-110m.json";
import { countryByNumericId, countryStatsMap } from "../data";

const GEO_URL = worldTopology as unknown as Topology;

interface WorldMapProps {
  selectedCountryId: string | null;
  onSelectCountry: (countryId: string) => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export default function WorldMap({ selectedCountryId, onSelectCountry }: WorldMapProps) {
  const [center, setCenter] = useState<[number, number]>([10, 20]);
  const [zoom, setZoom] = useState(1);

  // numericId -> 重心座標（検索/クリックで地図を移動させるために事前計算）
  const centroidByNumericId = useMemo(() => {
    const objectKey = Object.keys(GEO_URL.objects)[0];
    const collection = GEO_URL.objects[objectKey] as GeometryCollection;
    const featureCollection = topojsonClient.feature(GEO_URL, collection);
    const map: Record<string, [number, number]> = {};
    for (const f of featureCollection.features) {
      map[String(f.id)] = geoCentroid(f);
    }
    return map;
  }, []);

  const prevSelected = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedCountryId || selectedCountryId === prevSelected.current) return;
    prevSelected.current = selectedCountryId;
    const meta = Object.values(countryByNumericId).find((c) => c.id === selectedCountryId);
    if (!meta) return;
    const centroid = centroidByNumericId[String(meta.numericId)];
    if (centroid) {
      setCenter(centroid);
      setZoom(4);
    }
  }, [selectedCountryId, centroidByNumericId]);

  return (
    <ComposableMap
      projection="geoEqualEarth"
      style={{ width: "100%", height: "100%" }}
    >
      <ZoomableGroup
        center={center}
        zoom={zoom}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        onMoveEnd={({ coordinates, zoom }) => {
          setCenter(coordinates);
          setZoom(zoom);
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const meta = countryByNumericId[String(geo.id)];
              const hasData = meta ? Boolean(countryStatsMap[meta.id]) : false;
              const isSelected = meta ? meta.id === selectedCountryId : false;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (meta) onSelectCountry(meta.id);
                  }}
                  style={{
                    default: {
                      fill: isSelected ? "#f2994a" : hasData ? "#7fb3d5" : "#3b4a5a",
                      stroke: "#1b2530",
                      strokeWidth: 0.4,
                      outline: "none",
                      cursor: meta ? "pointer" : "default",
                      transition: "fill 120ms ease-in",
                    },
                    hover: {
                      fill: isSelected ? "#f2994a" : "#f6c453",
                      stroke: "#1b2530",
                      strokeWidth: 0.4,
                      outline: "none",
                      cursor: meta ? "pointer" : "default",
                    },
                    pressed: {
                      fill: "#e08e2d",
                      stroke: "#1b2530",
                      strokeWidth: 0.4,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
