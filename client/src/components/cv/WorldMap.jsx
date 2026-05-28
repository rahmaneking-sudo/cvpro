import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Sphere } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Basic dictionary to map French country names commonly used to English TopoJSON names
const frToEnMap = {
  "sénégal": "Senegal",
  "senegal": "Senegal",
  "france": "France",
  "états-unis": "United States of America",
  "etats-unis": "United States of America",
  "usa": "United States of America",
  "côte d'ivoire": "Côte d'Ivoire",
  "cote d'ivoire": "Côte d'Ivoire",
  "cameroun": "Cameroon",
  "mali": "Mali",
  "maroc": "Morocco",
  "algérie": "Algeria",
  "algerie": "Algeria",
  "tunisie": "Tunisia",
  "espagne": "Spain",
  "italie": "Italy",
  "allemagne": "Germany",
  "belgique": "Belgium",
  "suisse": "Switzerland",
  "royaume-uni": "United Kingdom",
  "canada": "Canada",
  "chine": "China",
  "japon": "Japan",
  "russie": "Russia",
  "brésil": "Brazil",
  "bresil": "Brazil",
  "inde": "India",
  "afrique du sud": "South Africa"
};

const normalizeName = (name) => {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  return frToEnMap[lower] || lower;
};

export default function WorldMap({ demographics, accent, text, secondary }) {
  // Normalize user input demographics locations
  const highlightedCountries = useMemo(() => {
    const list = [];
    if (demographics && demographics.length > 0) {
      demographics.forEach(demo => {
        if (demo.location) {
          list.push(normalizeName(demo.location).toLowerCase());
        }
      });
    }
    return list;
  }, [demographics]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Sphere stroke={secondary} strokeWidth={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties.name.toLowerCase();
              // Check if highlighted countries array includes this geography name or vice versa
              const isHighlighted = highlightedCountries.some(
                (hc) => hc === geoName || geoName.includes(hc) || hc.includes(geoName)
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isHighlighted ? accent : secondary}
                  stroke={text}
                  strokeWidth={isHighlighted ? 0.5 : 0.2}
                  style={{
                    default: { outline: "none", transition: "all 250ms" },
                    hover: { outline: "none", fill: accent, transition: "all 250ms" },
                    pressed: { outline: "none" },
                  }}
                  className={isHighlighted ? "animate-pulse" : ""}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
