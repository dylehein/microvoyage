import { useState } from "react";

const GOLD = "#c8a96e";
const GOLD_LIGHT = "rgba(200,169,110,0.15)";
const GOLD_BORDER = "rgba(200,169,110,0.4)";

// Destination visual themes: gradient colors + SVG pattern type
// pattern: "dots" | "grid" | "lines-h" | "lines-d" | "crosses" | "hex" | "zigzag" | "waves"
const DESTINATION_THEMES = {
  // ── North America domestic ──────────────────────────────────────────────
  "Nashville, TN":       { a:"#1a0a2e", b:"#6b0f6e", c:"#ff3cac", pattern:"lines-h",  // Broadway neon
                           textA:"#ff8de8", textB:"rgba(255,255,255,0.9)" },
  "New Orleans, LA":     { a:"#1a0d00", b:"#7a3800", c:"#d4820a", pattern:"dots",      // Jazz & gaslight
                           textA:"#ffd280", textB:"rgba(255,255,255,0.9)" },
  "Charleston, SC":      { a:"#0d2b1f", b:"#1a5c40", c:"#7ecfa4", pattern:"grid",      // Palmetto & moss
                           textA:"#b4f0d0", textB:"rgba(255,255,255,0.9)" },
  "Miami, FL":           { a:"#001433", b:"#003d7a", c:"#00c2e0", pattern:"lines-d",   // Art deco & ocean
                           textA:"#80edff", textB:"rgba(255,255,255,0.9)" },
  "Chicago, IL":         { a:"#0a0a18", b:"#1a1a40", c:"#4a4aff", pattern:"grid",      // City grid at night
                           textA:"#aaaaff", textB:"rgba(255,255,255,0.9)" },
  "Chicago":             { a:"#0a0a18", b:"#1a1a40", c:"#4a4aff", pattern:"grid",
                           textA:"#aaaaff", textB:"rgba(255,255,255,0.9)" },
  "Boston":              { a:"#0f0a00", b:"#3d2000", c:"#c87020", pattern:"lines-h",   // Beacon Hill red brick
                           textA:"#ffc080", textB:"rgba(255,255,255,0.9)" },
  "Philadelphia":        { a:"#1a0505", b:"#4a1010", c:"#c83030", pattern:"crosses",   // Liberty & colonial red
                           textA:"#ffaaaa", textB:"rgba(255,255,255,0.9)" },
  "Washington DC":       { a:"#0a0f1a", b:"#1a2a4a", c:"#4a7acd", pattern:"grid",     // Neoclassical columns
                           textA:"#a0c0ff", textB:"rgba(255,255,255,0.9)" },
  "New York City":       { a:"#080810", b:"#101030", c:"#f5c518", pattern:"lines-h",   // Yellow cabs & night
                           textA:"#ffe080", textB:"rgba(255,255,255,0.9)" },
  "Key West, FL":        { a:"#001a10", b:"#00402a", c:"#00c87a", pattern:"waves",     // Tropical teal
                           textA:"#80ffcc", textB:"rgba(255,255,255,0.9)" },
  "Savannah, GA":        { a:"#0a1405", b:"#1c3010", c:"#5a8040", pattern:"dots",      // Spanish moss & squares
                           textA:"#b0d890", textB:"rgba(255,255,255,0.9)" },
  "Asheville, NC":       { a:"#0d0a1a", b:"#2a1a40", c:"#8060c0", pattern:"lines-d",  // Blue Ridge mountain dusk
                           textA:"#c8a8ff", textB:"rgba(255,255,255,0.9)" },
  "Portland, OR":        { a:"#0a1205", b:"#1a2e10", c:"#3a6e30", pattern:"hex",       // PNW evergreen
                           textA:"#90c880", textB:"rgba(255,255,255,0.9)" },
  "Portland, ME":        { a:"#050d1a", b:"#0a2040", c:"#2060a0", pattern:"waves",     // Atlantic coast & fog
                           textA:"#80b8f0", textB:"rgba(255,255,255,0.9)" },
  "San Diego, CA":       { a:"#001020", b:"#002850", c:"#0080d0", pattern:"waves",     // Pacific blue
                           textA:"#60c8ff", textB:"rgba(255,255,255,0.9)" },
  "Santa Barbara, CA":   { a:"#1a0d05", b:"#402010", c:"#c06030", pattern:"lines-d",  // Mission terracotta
                           textA:"#ffb888", textB:"rgba(255,255,255,0.9)" },
  "Honolulu, HI":        { a:"#001a10", b:"#004030", c:"#00b890", pattern:"waves",     // Pacific turquoise
                           textA:"#60ffe0", textB:"rgba(255,255,255,0.9)" },
  "Milwaukee, WI":       { a:"#0a0505", b:"#301010", c:"#804020", pattern:"crosses",   // Industrial rust
                           textA:"#d08050", textB:"rgba(255,255,255,0.9)" },
  "Sedona, AZ":          { a:"#1a0500", b:"#4a1000", c:"#c03800", pattern:"lines-d",  // Red rock at sunrise
                           textA:"#ff9060", textB:"rgba(255,255,255,0.9)" },

  // ── Canada ──────────────────────────────────────────────────────────────
  "Montreal, QC":        { a:"#0f0510", b:"#2a1030", c:"#7a3090", pattern:"crosses",   // Jazz & art deco
                           textA:"#d090e8", textB:"rgba(255,255,255,0.9)" },
  "Quebec City, QC":     { a:"#0a0f1a", b:"#1a2840", c:"#3060a0", pattern:"lines-h",  // Winter fortress blue
                           textA:"#90b8f0", textB:"rgba(255,255,255,0.9)" },
  "Toronto, ON":         { a:"#080810", b:"#181830", c:"#303880", pattern:"grid",      // Skyline grid
                           textA:"#8898e0", textB:"rgba(255,255,255,0.9)" },
  "Vancouver, BC":       { a:"#040d10", b:"#0a2028", c:"#205868", pattern:"waves",     // Mountain fjord
                           textA:"#60c0d8", textB:"rgba(255,255,255,0.9)" },
  // ── Train-only destinations ─────────────────────────────────────────────
  "Baltimore, MD":       { a:"#0a0505", b:"#200a10", c:"#802030", pattern:"crosses",   // Inner Harbor brick
                           textA:"#e08090", textB:"rgba(255,255,255,0.9)" },
  "Providence, RI":      { a:"#050810", b:"#101828", c:"#304870", pattern:"lines-d",   // WaterFire & college hill
                           textA:"#8098d0", textB:"rgba(255,255,255,0.9)" },
  "New Haven, CT":       { a:"#050a05", b:"#102010", c:"#305030", pattern:"hex",        // Yale & elm streets
                           textA:"#70b080", textB:"rgba(255,255,255,0.9)" },
  "Richmond, VA":        { a:"#100505", b:"#301010", c:"#902828", pattern:"lines-h",   // Scott's Addition industrial
                           textA:"#e09090", textB:"rgba(255,255,255,0.9)" },
  "Charlottesville, VA": { a:"#080a05", b:"#182010", c:"#486830", pattern:"dots",       // Blue Ridge & vineyards
                           textA:"#a0c080", textB:"rgba(255,255,255,0.9)" },
  "Wilmington, DE":      { a:"#050810", b:"#101828", c:"#285878", pattern:"grid",       // Brandywine blue
                           textA:"#80b0d8", textB:"rgba(255,255,255,0.9)" },
  "Ann Arbor, MI":       { a:"#100800", b:"#302000", c:"#a06800", pattern:"crosses",   // Michigan maize
                           textA:"#ffc040", textB:"rgba(255,255,255,0.9)" },
  "San Luis Obispo, CA": { a:"#100500", b:"#301500", c:"#904820", pattern:"lines-d",   // Central Coast terracotta
                           textA:"#ffb070", textB:"rgba(255,255,255,0.9)" },
  "Portland, OR":        { a:"#0a1205", b:"#1a2e10", c:"#3a6e30", pattern:"hex",        // PNW evergreen
                           textA:"#90c880", textB:"rgba(255,255,255,0.9)" },
  "Cancún":              { a:"#001018", b:"#002838", c:"#00a8c8", pattern:"waves",     // Caribbean crystal
                           textA:"#60e8ff", textB:"rgba(255,255,255,0.9)" },
  "Nassau, Bahamas":     { a:"#001418", b:"#003040", c:"#00b0c0", pattern:"waves",     // Bahamian turquoise
                           textA:"#80f0ff", textB:"rgba(255,255,255,0.9)" },
  "Puerto Vallarta":     { a:"#180500", b:"#401000", c:"#c04808", pattern:"dots",      // Pacific sunset
                           textA:"#ff9860", textB:"rgba(255,255,255,0.9)" },
  "Cabo San Lucas":      { a:"#000d18", b:"#001c38", c:"#0058a0", pattern:"waves",     // Baja blue
                           textA:"#60a8e8", textB:"rgba(255,255,255,0.9)" },
  "Punta Cana":          { a:"#001810", b:"#003820", c:"#008850", pattern:"waves",     // Palm & green
                           textA:"#60e0a0", textB:"rgba(255,255,255,0.9)" },
  "Havana":              { a:"#180800", b:"#402000", c:"#b06000", pattern:"lines-d",   // Pastel & rum
                           textA:"#ffa840", textB:"rgba(255,255,255,0.9)" },
  "San Juan, PR":        { a:"#0a0010", b:"#200030", c:"#7000b0", pattern:"crosses",   // Old San Juan violet
                           textA:"#c860ff", textB:"rgba(255,255,255,0.9)" },

  // ── Latin America ───────────────────────────────────────────────────────
  "Mexico City":         { a:"#100010", b:"#300030", c:"#900090", pattern:"dots",      // Lucha libre & markets
                           textA:"#e060e0", textB:"rgba(255,255,255,0.9)" },
  "Oaxaca":              { a:"#180800", b:"#482008", c:"#c06818", pattern:"hex",        // Mezcal & marigolds
                           textA:"#ffb860", textB:"rgba(255,255,255,0.9)" },
  "Cartagena":           { a:"#1a0005", b:"#480010", c:"#c80028", pattern:"lines-d",   // Colonial reds
                           textA:"#ff6080", textB:"rgba(255,255,255,0.9)" },
  "Bogotá":              { a:"#050a18", b:"#101838", c:"#283878", pattern:"grid",       // Andes altitude
                           textA:"#8898e0", textB:"rgba(255,255,255,0.9)" },
  "Medellín":            { a:"#041008", b:"#0a2810", c:"#206830", pattern:"hex",        // Eternal spring
                           textA:"#70d890", textB:"rgba(255,255,255,0.9)" },
  "San José, Costa Rica":{ a:"#031008", b:"#083820", c:"#107040", pattern:"hex",        // Rainforest emerald
                           textA:"#50e090", textB:"rgba(255,255,255,0.9)" },

  // ── Europe ──────────────────────────────────────────────────────────────
  "Paris":               { a:"#100808", b:"#2a1818", c:"#7a3838", pattern:"lines-d",   // Haussmann rose & dusk
                           textA:"#e8a8a8", textB:"rgba(255,255,255,0.9)" },
  "London":              { a:"#080d10", b:"#101c20", c:"#204858", pattern:"lines-h",   // Fog & Thames grey
                           textA:"#80c0d8", textB:"rgba(255,255,255,0.9)" },
  "Amsterdam":           { a:"#030d18", b:"#082030", c:"#104870", pattern:"waves",     // Canal water
                           textA:"#60a0d8", textB:"rgba(255,255,255,0.9)" },
  "Barcelona":           { a:"#100500", b:"#301000", c:"#a03800", pattern:"hex",        // Gaudí & Catalan sun
                           textA:"#ffb060", textB:"rgba(255,255,255,0.9)" },
  "Lisbon":              { a:"#0a0800", b:"#281800", c:"#804808", pattern:"dots",       // Azulejo & fado
                           textA:"#e8a860", textB:"rgba(255,255,255,0.9)" },
  "Dublin":              { a:"#041008", b:"#0a2810", c:"#186030", pattern:"crosses",    // Emerald Isle
                           textA:"#60d880", textB:"rgba(255,255,255,0.9)" },
  "Edinburgh":           { a:"#080510", b:"#1a1028", c:"#503870", pattern:"lines-d",   // Thistle & Highland dusk
                           textA:"#c0a0e0", textB:"rgba(255,255,255,0.9)" },
  "Copenhagen":          { a:"#030810", b:"#081828", c:"#184068", pattern:"dots",       // Nyhavn blue
                           textA:"#70b0e8", textB:"rgba(255,255,255,0.9)" },
  "Rome":                { a:"#180800", b:"#402000", c:"#c06818", pattern:"lines-d",    // Travertine & amber
                           textA:"#ffb860", textB:"rgba(255,255,255,0.9)" },
  "Reykjavik":           { a:"#000810", b:"#001838", c:"#003878", pattern:"waves",      // Aurora over black sand
                           textA:"#50d0ff", textB:"rgba(255,255,255,0.9)" },

  // ── Africa & Middle East ────────────────────────────────────────────────
  "Marrakech":           { a:"#180500", b:"#502000", c:"#c86020", pattern:"hex",        // Souk saffron & terracotta
                           textA:"#ffb860", textB:"rgba(255,255,255,0.9)" },
  "Cape Town":           { a:"#050d18", b:"#0e2038", c:"#1e4878", pattern:"lines-d",   // Table Mountain ocean
                           textA:"#70b0f0", textB:"rgba(255,255,255,0.9)" },

  // ── Asia ────────────────────────────────────────────────────────────────
  "Tokyo":               { a:"#080010", b:"#1a0030", c:"#6000c0", pattern:"grid",       // Shibuya neon grid
                           textA:"#e060ff", textB:"rgba(255,255,255,0.9)" },
  "Seoul":               { a:"#000810", b:"#001830", c:"#003880", pattern:"crosses",    // Han River night
                           textA:"#60a8ff", textB:"rgba(255,255,255,0.9)" },
  "Bangkok":             { a:"#100500", b:"#381000", c:"#a83000", pattern:"dots",        // Temple gold & saffron
                           textA:"#ffa040", textB:"rgba(255,255,255,0.9)" },
};

// Generate SVG pattern as a data URI
const patternSvg = (type, color) => {
  const c = color; // semi-transparent accent color
  const patterns = {
    "dots":    `<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="${c}" opacity="0.35"/></pattern>`,
    "grid":    `<pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0L0 0 0 28" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3"/></pattern>`,
    "lines-h": `<pattern id="p" width="1" height="18" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="1" y2="0" stroke="${c}" stroke-width="0.8" opacity="0.3"/></pattern>`,
    "lines-d": `<pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><line x1="0" y1="20" x2="20" y2="0" stroke="${c}" stroke-width="0.7" opacity="0.28"/></pattern>`,
    "crosses": `<pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse"><line x1="11" y1="5" x2="11" y2="17" stroke="${c}" stroke-width="0.8" opacity="0.3"/><line x1="5" y1="11" x2="17" y2="11" stroke="${c}" stroke-width="0.8" opacity="0.3"/></pattern>`,
    "hex":     `<pattern id="p" width="30" height="26" patternUnits="userSpaceOnUse"><polygon points="15,1 28,8 28,18 15,25 2,18 2,8" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.28"/></pattern>`,
    "waves":   `<pattern id="p" width="40" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 Q10 1 20 7 Q30 13 40 7" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.3"/></pattern>`,
    "zigzag":  `<pattern id="p" width="20" height="10" patternUnits="userSpaceOnUse"><polyline points="0,10 10,0 20,10" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.3"/></pattern>`,
  };
  const pat = patterns[type] || patterns["dots"];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><defs>${pat}</defs><rect width='100%' height='100%' fill='url(%23p)'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g,'%23').replace(/"/g,"'")}")`;
};

const getTheme = (city) => DESTINATION_THEMES[city] || { a:"#0a1a10", b:"#1a3a20", c:"#3a7a50", pattern:"dots", textA:"#90c8a8", textB:"rgba(255,255,255,0.9)" };

const AIRPORTS = {
  "Washington DC": ["DCA","IAD","BWI"],
  "New York": ["JFK","LGA","EWR"],
  "Los Angeles": ["LAX","BUR","SNA"],
  "Chicago": ["ORD","MDW"],
  "San Francisco": ["SFO","OAK","SJC"],
  "Boston": ["BOS","PVD"],
  "Miami": ["MIA","FLL"],
  "Dallas": ["DFW","DAL"],
  "Seattle": ["SEA"],
  "Atlanta": ["ATL"],
  "Denver": ["DEN"],
  "Phoenix": ["PHX"],
  "Houston": ["IAH","HOU"],
  "Philadelphia": ["PHL"],
  "Minneapolis": ["MSP"],
  "Portland": ["PDX"],
  "Las Vegas": ["LAS"],
  "Orlando": ["MCO"],
  "Tampa": ["TPA"],
};

const MOOD_OPTIONS = [
  { key:"all",      label:"✈️ All",          desc:"Show everything" },
  { key:"warm",     label:"☀️ Warm Weather",  desc:"Sun, beach, heat" },
  { key:"cozy",     label:"🕯️ Cozy",          desc:"Charming, intimate" },
  { key:"culture",  label:"🏛️ Culture",       desc:"Art, history, museums" },
  { key:"food",     label:"🍽️ Food & Drink",  desc:"Culinary adventures" },
  { key:"nature",   label:"🌿 Nature",         desc:"Outdoors & scenery" },
  { key:"city",     label:"🌆 City Energy",    desc:"Urban buzz" },
  { key:"romance",  label:"💫 Romance",        desc:"Intimate & beautiful" },
  { key:"adventure",label:"🏔️ Adventure",     desc:"Active & thrilling" },
  { key:"international", label:"🌍 International", desc:"Passport required" },
];

// moods: array of mood keys that apply to each trip
const ALL_TRIPS = [
  // ── DOMESTIC ────────────────────────────────────────────────────────────
  // flightH = real average nonstop block time (gate-to-gate) from hub
  // cityTransitH = time from airport to city center (hours)
  { city:"Nashville, TN",      ap:"BNA", domestic:true,  moods:["food","culture","city"],          hubs:["Washington DC","New York","Chicago","Atlanta","Philadelphia","Boston"],          price:260, flightH:2.25, cityTransitH:0.33, vibe:"Music & Food",  flag:"🇺🇸", highlights:["Broadway honky-tonks","Hot chicken at Prince's","Ryman Auditorium"] , hotel:[89,159,320] },
  { city:"Charleston, SC",     ap:"CHS", domestic:true,  moods:["cozy","warm","culture","romance"], hubs:["Washington DC","New York","Boston","Philadelphia","Atlanta"],                    price:195, flightH:1.75, cityTransitH:0.33, vibe:"History",       flag:"🇺🇸", highlights:["Rainbow Row","Magnolia Plantation","She-crab soup"] , hotel:[110,185,380] },
  { city:"Savannah, GA",       ap:"SAV", domestic:true,  moods:["cozy","romance","culture"],        hubs:["Washington DC","New York","Boston","Philadelphia","Atlanta"],                    price:175, flightH:2.0,  cityTransitH:0.33, vibe:"History",       flag:"🇺🇸", highlights:["Forsyth Park","River Street squares","Midnight in the Garden vibes"] , hotel:[95,165,310] },
  { city:"New Orleans, LA",    ap:"MSY", domestic:true,  moods:["food","culture","city","romance"], hubs:["Washington DC","New York","Chicago","Houston","Atlanta","Dallas"],               price:290, flightH:3.0,  cityTransitH:0.5,  vibe:"Culture",       flag:"🇺🇸", highlights:["French Quarter","Café du Monde beignets","Jazz on Frenchmen St"] , hotel:[95,175,350] },
  { city:"Miami, FL",          ap:"MIA", domestic:true,  moods:["warm","city","romance","food"],    hubs:["Washington DC","New York","Boston","Chicago","Philadelphia","Atlanta"],          price:230, flightH:2.75, cityTransitH:0.5,  vibe:"Beach",         flag:"🇺🇸", highlights:["South Beach","Wynwood Walls","Little Havana"] , hotel:[130,220,480] },
  { city:"Key West, FL",       ap:"EYW", domestic:true,  moods:["warm","cozy","romance"],           hubs:["Washington DC","New York","Atlanta","Chicago"],                                  price:350, flightH:3.25, cityTransitH:0.17, vibe:"Beach",         flag:"🇺🇸", highlights:["Duval Street","Sunset at Mallory Square","Snorkeling coral reefs"] , hotel:[180,290,520] },
  { city:"Asheville, NC",      ap:"AVL", domestic:true,  moods:["cozy","nature","food","romance"],  hubs:["Washington DC","New York","Atlanta","Philadelphia","Charlotte"],                 price:160, flightH:1.5,  cityTransitH:0.25, vibe:"Nature",        flag:"🇺🇸", highlights:["Blue Ridge Parkway","Biltmore Estate","Craft brewery scene"] , hotel:[95,160,300] },
  { city:"Chicago, IL",        ap:"ORD", domestic:true,  moods:["city","food","culture","adventure"],hubs:["Washington DC","New York","Boston","Miami","Atlanta","Philadelphia"],           price:255, flightH:2.25, cityTransitH:0.75, vibe:"City",          flag:"🇺🇸", highlights:["Millennium Park","Deep dish at Lou Malnati's","Art Institute"] , hotel:[110,195,420] },
  { city:"Portland, ME",       ap:"PWM", domestic:true,  moods:["cozy","food","nature"],            hubs:["New York","Boston","Washington DC","Philadelphia"],                              price:145, flightH:1.5,  cityTransitH:0.25, vibe:"Food",          flag:"🇺🇸", highlights:["Lobster at Red's Eats","Old Port District","L.L.Bean flagship"] , hotel:[80,140,260] },
  { city:"Montreal, QC",       ap:"YUL", domestic:false, moods:["culture","food","cozy","romance"], hubs:["New York","Boston","Washington DC","Philadelphia","Chicago"],                    price:195, flightH:1.75, cityTransitH:0.5,  vibe:"Culture",       flag:"🇨🇦", highlights:["Old Montreal cobblestones","Poutine & bagels","Mont Royal Park"] , hotel:[90,155,300] },
  { city:"Quebec City, QC",    ap:"YQB", domestic:false, moods:["cozy","romance","culture"],        hubs:["New York","Boston","Washington DC"],                                             price:230, flightH:2.25, cityTransitH:0.33, vibe:"History",       flag:"🇨🇦", highlights:["Château Frontenac","Old City walls","Poutine & maple everything"] , hotel:[100,170,320] },
  { city:"Toronto, ON",        ap:"YYZ", domestic:false, moods:["city","culture","food"],           hubs:["New York","Boston","Washington DC","Chicago","Philadelphia","Miami"],            price:210, flightH:1.5,  cityTransitH:0.75, vibe:"City",          flag:"🇨🇦", highlights:["Distillery District","CN Tower views","Diverse food scene"] , hotel:[110,185,380] },
  { city:"Reykjavik",          ap:"KEF", domestic:false, moods:["adventure","nature","romance"],    hubs:["New York","Boston","Washington DC","Chicago","Seattle"],                         price:650, flightH:6.5,  cityTransitH:0.75, vibe:"Adventure",     flag:"🇮🇸", highlights:["Northern Lights","Blue Lagoon geothermal spa","Golden Circle"] , hotel:[120,210,400] },
  { city:"London",             ap:"LHR", domestic:false, moods:["culture","city","food","cozy"],    hubs:["New York","Washington DC","Boston","Chicago","Miami","Atlanta","Los Angeles","San Francisco","Seattle","Dallas","Houston"],price:620, flightH:7.0, cityTransitH:1.0, vibe:"Culture", flag:"🇬🇧", highlights:["Borough Market","Tate Modern","Covent Garden"] , hotel:[130,230,550] },
  { city:"Paris",              ap:"CDG", domestic:false, moods:["romance","culture","food","cozy"], hubs:["New York","Washington DC","Boston","Chicago","Miami","Los Angeles","Atlanta"],   price:680, flightH:7.5,  cityTransitH:1.0,  vibe:"Romance",      flag:"🇫🇷", highlights:["Marais neighborhood","Musée d'Orsay","Wine & cheese picnic"] , hotel:[120,220,600] },
  { city:"Amsterdam",          ap:"AMS", domestic:false, moods:["culture","city","romance","food"], hubs:["New York","Washington DC","Boston","Chicago","Atlanta","Houston"],               price:640, flightH:7.75, cityTransitH:0.33, vibe:"Culture",      flag:"🇳🇱", highlights:["Rijksmuseum","Canal boat ride","Vondelpark"] , hotel:[110,200,480] },
  { city:"Lisbon",             ap:"LIS", domestic:false, moods:["warm","romance","food","culture"], hubs:["New York","Washington DC","Boston","Miami","Chicago"],                           price:590, flightH:7.25, cityTransitH:0.5,  vibe:"Culture",      flag:"🇵🇹", highlights:["Alfama fado music","Pastéis de nata","Belém Tower"] , hotel:[90,160,360] },
  { city:"Barcelona",          ap:"BCN", domestic:false, moods:["warm","culture","food","romance"], hubs:["New York","Washington DC","Miami","Chicago","Los Angeles","Atlanta"],            price:670, flightH:8.5,  cityTransitH:0.5,  vibe:"Culture",      flag:"🇪🇸", highlights:["Sagrada Família","La Boqueria market","Barceloneta beach"] , hotel:[100,185,420] },
  { city:"Rome",               ap:"FCO", domestic:false, moods:["culture","food","romance"],        hubs:["New York","Washington DC","Boston","Chicago","Miami","Los Angeles","Atlanta"],   price:710, flightH:9.5,  cityTransitH:0.75, vibe:"History",      flag:"🇮🇹", highlights:["Colosseum","Trastevere trattorias","Gelato at every corner"] , hotel:[100,190,440] },
  { city:"Dublin",             ap:"DUB", domestic:false, moods:["cozy","culture","food"],           hubs:["New York","Washington DC","Boston","Chicago","Philadelphia","Atlanta"],          price:520, flightH:6.75, cityTransitH:0.5,  vibe:"Cozy",         flag:"🇮🇪", highlights:["Temple Bar pubs","Guinness Storehouse","Howth coastal walk"] , hotel:[110,195,400] },
  { city:"Edinburgh",          ap:"EDI", domestic:false, moods:["cozy","culture","adventure"],      hubs:["New York","Washington DC","Boston","Chicago","Philadelphia"],                    price:580, flightH:7.5,  cityTransitH:0.33, vibe:"History",      flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", highlights:["Edinburgh Castle","Royal Mile whisky tasting","Arthur's Seat hike"] , hotel:[100,175,350] },
  { city:"Copenhagen",         ap:"CPH", domestic:false, moods:["cozy","food","culture"],           hubs:["New York","Washington DC","Chicago","Boston","Atlanta"],                         price:650, flightH:8.5,  cityTransitH:0.5,  vibe:"Cozy",         flag:"🇩🇰", highlights:["Noma-style New Nordic cuisine","Tivoli Gardens","Nyhavn waterfront"] , hotel:[130,220,480] },
  { city:"Mexico City",        ap:"MEX", domestic:false, moods:["culture","food","city","warm"],    hubs:["Los Angeles","Houston","Dallas","Chicago","New York","Miami","Washington DC","Atlanta"],price:380, flightH:3.5, cityTransitH:0.75, vibe:"Culture", flag:"🇲🇽", highlights:["Frida Kahlo Museum","Tacos al pastor","Teotihuacán pyramids"] , hotel:[55,110,280] },
  { city:"Cancún",             ap:"CUN", domestic:false, moods:["warm","adventure","romance"],      hubs:["New York","Chicago","Washington DC","Dallas","Houston","Atlanta","Philadelphia","Boston","Miami"],price:420, flightH:3.25, cityTransitH:0.33, vibe:"Beach", flag:"🇲🇽", highlights:["Turquoise Caribbean waters","Cenote swimming","Tulum ruins"] , hotel:[80,160,380] },
  { city:"Havana",             ap:"HAV", domestic:false, moods:["culture","romance","warm","cozy"], hubs:["Miami","New York","Washington DC","Atlanta","Houston"],                          price:350, flightH:1.5,  cityTransitH:0.5,  vibe:"Culture",      flag:"🇨🇺", highlights:["Classic car tours","Mojitos at La Bodeguita","Malecón sunset"] , hotel:[45,90,180] },
  { city:"San José, Costa Rica",ap:"SJO",domestic:false, moods:["adventure","nature","warm"],       hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta","Los Angeles"],   price:490, flightH:3.5,  cityTransitH:0.5,  vibe:"Adventure",   flag:"🇨🇷", highlights:["Cloud forest canopy zip-lining","Arenal Volcano","Wildlife spotting"] , hotel:[60,120,250] },
  { city:"Cartagena",          ap:"CTG", domestic:false, moods:["warm","romance","culture","cozy"], hubs:["Miami","New York","Washington DC","Atlanta","Houston","Chicago"],                price:480, flightH:3.5,  cityTransitH:0.33, vibe:"Romance",      flag:"🇨🇴", highlights:["Walled city colonial architecture","Rosario Islands","Ceviche & arepas"] , hotel:[65,130,300] },
  { city:"Tokyo",              ap:"NRT", domestic:false, moods:["culture","food","city","adventure"],hubs:["Los Angeles","San Francisco","Seattle","New York","Chicago","Houston","Dallas"], price:1050,flightH:11.5, cityTransitH:1.0,  vibe:"City",         flag:"🇯🇵", highlights:["Tsukiji outer market sushi","Shibuya crossing","Yanaka old neighborhood"] , hotel:[80,160,420] },
  { city:"Seoul",              ap:"ICN", domestic:false, moods:["culture","food","city"],           hubs:["Los Angeles","San Francisco","Seattle","New York","Chicago"],                    price:950, flightH:11.5, cityTransitH:1.0,  vibe:"City",         flag:"🇰🇷", highlights:["Gwangjang Market street food","Bukchon Hanok Village","K-beauty shopping"] , hotel:[70,140,360] },
  { city:"Bangkok",            ap:"BKK", domestic:false, moods:["warm","food","culture","adventure"],hubs:["Los Angeles","San Francisco","Seattle","New York","Houston","Dallas"],          price:890, flightH:17.5, cityTransitH:1.0,  vibe:"Culture",     flag:"🇹🇭", highlights:["Floating markets","Wat Pho temple","Street pad thai"] , hotel:[35,80,220] },
  { city:"Medellín",           ap:"MDE", domestic:false, moods:["warm","culture","adventure","romance"],hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta"],             price:450, flightH:3.5,  cityTransitH:0.5,  vibe:"City",         flag:"🇨🇴", highlights:["Flower Festival","Pablo Escobar tour","El Poblado cafés"] , hotel:[45,95,220] },
  { city:"Oaxaca",             ap:"OAX", domestic:false, moods:["culture","food","cozy","warm"],    hubs:["Los Angeles","Houston","Dallas","Chicago","New York","Miami"],                   price:410, flightH:4.0,  cityTransitH:0.5,  vibe:"Culture",      flag:"🇲🇽", highlights:["Mezcal tasting","Zócalo colonial square","Mole negro"] , hotel:[50,100,220] },
  { city:"San Juan, PR",       ap:"SJU", domestic:true,  moods:["warm","romance","culture","food"], hubs:["New York","Washington DC","Boston","Philadelphia","Miami","Atlanta","Chicago"],  price:320, flightH:3.5,  cityTransitH:0.33, vibe:"Beach",        flag:"🇵🇷", highlights:["Old San Juan forts","Bioluminescent bay kayaking","Lechón at La Guardarraya"] , hotel:[110,190,400] },
  { city:"Marrakech",          ap:"RAK", domestic:false, moods:["culture","cozy","romance","adventure"],hubs:["New York","Washington DC","Miami","Boston","Chicago"],                       price:780, flightH:9.0,  cityTransitH:0.75, vibe:"Culture",      flag:"🇲🇦", highlights:["Jemaa el-Fna medina","Hammam spa","Spice souk"] , hotel:[60,130,350] },
  { city:"Cape Town",          ap:"CPT", domestic:false, moods:["adventure","nature","warm","romance"],hubs:["New York","Washington DC","Atlanta","Miami"],                                 price:1200,flightH:16.0, cityTransitH:0.75, vibe:"Adventure",   flag:"🇿🇦", highlights:["Table Mountain cable car","Boulders Beach penguins","Cape Winelands"] , hotel:[75,150,380] },
  { city:"Bogotá",             ap:"BOG", domestic:false, moods:["culture","food","city","adventure"],hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta"],                price:420, flightH:4.25, cityTransitH:0.75, vibe:"City",         flag:"🇨🇴", highlights:["Gold Museum","Candelaria neighborhood","Emeralds & coffee shopping"] , hotel:[50,100,240] },
  { city:"Nassau, Bahamas",    ap:"NAS", domestic:false, moods:["warm","romance","adventure"],      hubs:["Miami","New York","Washington DC","Atlanta","Charlotte","Philadelphia"],         price:310, flightH:2.5,  cityTransitH:0.33, vibe:"Beach",        flag:"🇧🇸", highlights:["Crystal-clear swimming with pigs","Atlantis resort","Junkanoo Beach"] , hotel:[130,230,480] },
  { city:"Punta Cana",         ap:"PUJ", domestic:false, moods:["warm","romance","adventure"],      hubs:["New York","Washington DC","Miami","Boston","Philadelphia","Chicago","Atlanta"],  price:380, flightH:4.0,  cityTransitH:0.5,  vibe:"Beach",        flag:"🇩🇴", highlights:["Bavaro Beach","Hoyo Azul cenote swimming","Local mamajuana rum"] , hotel:[90,180,400] },
  // West Coast focused
  { city:"Vancouver, BC",      ap:"YVR", domestic:false, moods:["nature","food","city","culture"],  hubs:["Seattle","Los Angeles","San Francisco","Portland"],                              price:220, flightH:1.0,  cityTransitH:0.5,  vibe:"Nature",       flag:"🇨🇦", highlights:["Stanley Park seawall","Granville Island market","North Shore hiking"] , hotel:[110,190,400] },
  { city:"Portland, OR",       ap:"PDX", domestic:true,  moods:["food","cozy","nature","culture"],  hubs:["Seattle","San Francisco","Los Angeles","Las Vegas","Denver"],                   price:180, flightH:1.0,  cityTransitH:0.33, vibe:"Food",         flag:"🇺🇸", highlights:["Powell's Books","Voodoo Doughnut","Forest Park trails"] , hotel:[85,150,300] },
  { city:"San Diego, CA",      ap:"SAN", domestic:true,  moods:["warm","nature","food","adventure"],hubs:["San Francisco","Seattle","Portland","Denver","Las Vegas","Phoenix"],            price:160, flightH:1.25, cityTransitH:0.25, vibe:"Beach",        flag:"🇺🇸", highlights:["Balboa Park","Fish tacos in Old Town","La Jolla sea caves"] , hotel:[110,185,380] },
  { city:"Sedona, AZ",         ap:"SEZ", domestic:true,  moods:["nature","adventure","cozy","romance"],hubs:["Los Angeles","Las Vegas","Denver","Dallas","Houston","Phoenix"],             price:200, flightH:1.75, cityTransitH:0.5,  vibe:"Adventure",    flag:"🇺🇸", highlights:["Red rock hiking","Vortex energy spots","Tlaquepaque art village"] , hotel:[130,210,420] },
  { city:"Honolulu, HI",       ap:"HNL", domestic:true,  moods:["warm","romance","nature","adventure"],hubs:["Los Angeles","San Francisco","Seattle","Portland","Las Vegas"],             price:480, flightH:5.75, cityTransitH:0.5,  vibe:"Beach",        flag:"🇺🇸", highlights:["Waimea Valley hike","Sunrise at Diamond Head","North Shore shave ice"] , hotel:[140,240,520] },
  { city:"Cabo San Lucas",     ap:"SJD", domestic:false, moods:["warm","romance","adventure","food"],hubs:["Los Angeles","San Francisco","Seattle","Dallas","Houston","Denver","Phoenix","Las Vegas"],price:350,flightH:2.5, cityTransitH:0.5,  vibe:"Beach",flag:"🇲🇽", highlights:["Arch of Cabo San Lucas","Sport fishing","Playa del Amor"] , hotel:[100,200,480] },
  { city:"Puerto Vallarta",    ap:"PVR", domestic:false, moods:["warm","romance","food","culture"],  hubs:["Los Angeles","San Francisco","Seattle","Dallas","Houston","Denver","Chicago"],  price:370, flightH:2.75, cityTransitH:0.33, vibe:"Beach",        flag:"🇲🇽", highlights:["Malecón sculpture walk","Zona Romántica dining","Sierra Madre jungle tour"] , hotel:[80,160,380] },
];

// ── TRAIN TRIPS ──────────────────────────────────────────────────────────────
// hubs = cities with Amtrak service nearby; trainH = one-way trip hours
const TRAIN_TRIPS = [
  // ── Northeast Corridor ────────────────────────────────────────────────
  { city:"New York City",     station:"NYP", stationName:"Penn Station",         hubs:["Washington DC","Philadelphia","Boston","Baltimore"], trainH:{"Washington DC":3.0,"Philadelphia":1.25,"Boston":3.5,"Baltimore":3.5}, price:{"Washington DC":89,"Philadelphia":29,"Boston":110,"Baltimore":99}, moods:["city","food","culture","romance"], vibe:"City", flag:"🇺🇸", highlights:["Central Park","Chelsea food halls","Brooklyn Bridge walk"], hotel:[120,220,480] },
  { city:"Philadelphia",      station:"PHL", stationName:"30th Street Station",  hubs:["Washington DC","New York","Boston","Baltimore"], trainH:{"Washington DC":1.75,"New York":1.25,"Boston":5.5,"Baltimore":1.0}, price:{"Washington DC":49,"New York":29,"Boston":89,"Baltimore":29}, moods:["culture","food","history"], vibe:"History", flag:"🇺🇸", highlights:["Reading Terminal Market","Eastern State Penitentiary","Cheesesteak tour"], hotel:[90,160,320] },
  { city:"Washington DC",     station:"WAS", stationName:"Union Station",        hubs:["New York","Philadelphia","Boston","Baltimore"], trainH:{"New York":3.0,"Philadelphia":1.75,"Boston":6.5,"Baltimore":0.5}, price:{"New York":89,"Philadelphia":49,"Boston":120,"Baltimore":15}, moods:["culture","city","history"], vibe:"Culture", flag:"🇺🇸", highlights:["Smithsonian museums","Capitol Hill","Georgetown waterfront"], hotel:[100,180,400] },
  { city:"Baltimore, MD",     station:"BAL", stationName:"Penn Station",         hubs:["Washington DC","New York","Philadelphia"], trainH:{"Washington DC":0.5,"New York":3.0,"Philadelphia":1.0}, price:{"Washington DC":15,"New York":69,"Philadelphia":29}, moods:["food","culture","city"], vibe:"Food", flag:"🇺🇸", highlights:["Inner Harbor","Fells Point crab cakes","Enoch Pratt Free Library"], hotel:[80,145,290] },
  { city:"Boston",            station:"BOS", stationName:"South Station",        hubs:["New York","Washington DC","Philadelphia","Providence"], trainH:{"New York":3.5,"Washington DC":6.5,"Philadelphia":5.5,"Providence":1.0}, price:{"New York":110,"Washington DC":120,"Philadelphia":89,"Providence":19}, moods:["culture","food","history","cozy"], vibe:"History", flag:"🇺🇸", highlights:["Freedom Trail walk","Fenway Park","North End pasta & cannoli"], hotel:[110,190,420] },
  { city:"Providence, RI",    station:"PVD", stationName:"Providence Station",   hubs:["New York","Boston"], trainH:{"New York":3.0,"Boston":1.0}, price:{"New York":39,"Boston":19}, moods:["food","cozy","culture"], vibe:"Food", flag:"🇺🇸", highlights:["WaterFire sculpture","Federal Hill Italian food","RISD Museum"], hotel:[75,130,260] },
  { city:"New Haven, CT",     station:"NHV", stationName:"Union Station",        hubs:["New York","Boston"], trainH:{"New York":1.75,"Boston":2.5}, price:{"New York":22,"Boston":45}, moods:["food","culture","cozy"], vibe:"Food", flag:"🇺🇸", highlights:["Frank Pepe's original pizza","Yale campus & art gallery","Wooster Square"], hotel:[70,125,240] },
  { city:"Richmond, VA",      station:"RVR", stationName:"Main Street Station",  hubs:["Washington DC","New York","Philadelphia"], trainH:{"Washington DC":2.25,"New York":5.5,"Philadelphia":3.5}, price:{"Washington DC":29,"New York":79,"Philadelphia":55}, moods:["food","culture","cozy","city"], vibe:"Food", flag:"🇺🇸", highlights:["Scott's Addition breweries","Canal Walk","The Fan neighborhood"], hotel:[75,135,270] },
  { city:"Charlottesville, VA",station:"CVS",stationName:"Charlottesville Amtrak",hubs:["Washington DC","New York"], trainH:{"Washington DC":2.5,"New York":6.0}, price:{"Washington DC":35,"New York":89}, moods:["cozy","romance","food","nature"], vibe:"Cozy", flag:"🇺🇸", highlights:["Monticello","Downtown Mall dining","Shenandoah Valley day trips"], hotel:[80,145,280] },
  // ── Mid-Atlantic ──────────────────────────────────────────────────────
  { city:"Wilmington, DE",    station:"WIL", stationName:"Wilmington Station",   hubs:["Washington DC","New York","Philadelphia"], trainH:{"Washington DC":1.25,"New York":1.75,"Philadelphia":0.5}, price:{"Washington DC":35,"New York":45,"Philadelphia":12}, moods:["cozy","culture"], vibe:"History", flag:"🇺🇸", highlights:["Brandywine Valley gardens","Hagley Museum","Wilmington Riverfront"], hotel:[70,120,240] },
  // ── Midwest ───────────────────────────────────────────────────────────
  { city:"Chicago",           station:"CHI", stationName:"Union Station",        hubs:["Minneapolis","Milwaukee","Detroit","St. Louis"], trainH:{"Minneapolis":7.5,"Milwaukee":1.5,"Detroit":5.5,"St. Louis":5.5}, price:{"Minneapolis":49,"Milwaukee":25,"Detroit":39,"St. Louis":35}, moods:["city","food","culture"], vibe:"City", flag:"🇺🇸", highlights:["Architecture river cruise","Deep dish pizza","Art Institute"], hotel:[110,195,420] },
  { city:"Milwaukee, WI",     station:"MKE", stationName:"Intermodal Station",   hubs:["Chicago"], trainH:{"Chicago":1.5}, price:{"Chicago":25}, moods:["food","cozy","culture"], vibe:"Food", flag:"🇺🇸", highlights:["Lakefront brewery row","Milwaukee Art Museum","Custard at Kopp's"], hotel:[70,130,260] },
  { city:"Ann Arbor, MI",     station:"ARB", stationName:"Ann Arbor Amtrak",     hubs:["Chicago"], trainH:{"Chicago":4.5}, price:{"Chicago":39}, moods:["food","culture","cozy"], vibe:"Culture", flag:"🇺🇸", highlights:["University of Michigan campus","Zingerman's Deli","Kerrytown farmers market"], hotel:[75,135,270] },
  // ── California ────────────────────────────────────────────────────────
  { city:"San Diego, CA",     station:"SAN", stationName:"Santa Fe Depot",       hubs:["Los Angeles"], trainH:{"Los Angeles":2.75}, price:{"Los Angeles":35}, moods:["warm","nature","food"], vibe:"Beach", flag:"🇺🇸", highlights:["Balboa Park","Fish tacos in Old Town","Gaslamp Quarter"], hotel:[110,185,380] },
  { city:"Santa Barbara, CA", station:"SBA", stationName:"Santa Barbara Station",hubs:["Los Angeles","San Francisco"], trainH:{"Los Angeles":2.5,"San Francisco":5.5}, price:{"Los Angeles":30,"San Francisco":65}, moods:["warm","romance","food","cozy"], vibe:"Romance", flag:"🇺🇸", highlights:["State Street wine tasting","Butterfly Beach","Mission Santa Barbara"], hotel:[120,210,430] },
  { city:"San Luis Obispo, CA",station:"SLO",stationName:"San Luis Obispo Amtrak",hubs:["Los Angeles","San Francisco"], trainH:{"Los Angeles":5.5,"San Francisco":3.5}, price:{"Los Angeles":45,"San Francisco":42}, moods:["cozy","nature","food","romance"], vibe:"Nature", flag:"🇺🇸", highlights:["Bubblegum Alley","Edna Valley wine country","Morro Bay"], hotel:[85,155,300] },
  // ── Pacific Northwest ─────────────────────────────────────────────────
  { city:"Portland, OR",      station:"PDX", stationName:"Union Station",        hubs:["Seattle"], trainH:{"Seattle":3.5}, price:{"Seattle":40}, moods:["food","cozy","culture","nature"], vibe:"Food", flag:"🇺🇸", highlights:["Powell's Books","Voodoo Doughnut","Forest Park trails"], hotel:[90,160,320] },
  { city:"Vancouver, BC",     station:"VAC", stationName:"Pacific Central",      hubs:["Seattle"], trainH:{"Seattle":4.0}, price:{"Seattle":40}, moods:["city","nature","food","culture"], vibe:"City", flag:"🇨🇦", highlights:["Stanley Park seawall","Granville Island market","Gastown cobblestones"], hotel:[110,195,400] },
];

// Amtrak station codes for hubs
const AMTRAK_STATIONS = {
  "Washington DC": "WAS",
  "New York":      "NYP",
  "Boston":        "BOS",
  "Philadelphia":  "PHL",
  "Baltimore":     "BAL",
  "Chicago":       "CHI",
  "Los Angeles":   "LAX",
  "San Francisco": "OKJ",
  "Seattle":       "SEA",
  "Minneapolis":   "MSP",
  "Milwaukee":     "MKE",
  "Detroit":       "DET",
  "St. Louis":     "STL",
  "Providence":    "PVD",
};

function generateTrainTrips(region, days, budget, moods) {
  return TRAIN_TRIPS.filter(t => {
    const hasHub = Object.keys(t.trainH).some(h => h === region);
    const moodOk = moods.includes("all") || moods.some(m => t.moods.includes(m));
    const fromHub = Object.keys(t.trainH).find(h => h === region);
    const price = fromHub ? t.price[fromHub] * 2 : 999;
    // For 1-day trips, cap at 4h each way so you get at least ~8h on the ground
    const oneWayH = fromHub ? t.trainH[fromHub] : 99;
    if (days === 1 && oneWayH > 4) return false;
    return hasHub && moodOk && price <= budget;
  }).map((t, i) => {
    const fromHub = Object.keys(t.trainH).find(h => h === region);
    const oneWayH = t.trainH[fromHub] || 2;
    const roundTripPrice = Math.round(t.price[fromHub] * 2 * 1.1);
    const fromStation = AMTRAK_STATIONS[region] || "WAS";
    const groundH = days === 1
      ? Math.max(4, 16 - oneWayH * 2)
      : (days - 1) * 22 + (18 - oneWayH * 2);
    return {
      id: "train-" + i,
      isTrain: true,
      destination_city: t.city,
      destination_station: t.station,
      station_name: t.stationName,
      flag: t.flag,
      fromStation,
      fromHub,
      one_way_hours: oneWayH,
      total_price: roundTripPrice,
      total_price_pp: roundTripPrice,
      party: 1,
      hours_on_ground: Math.round(groundH * 10) / 10,
      destination_highlights: t.highlights,
      vibe: t.vibe,
      moods: t.moods,
      score: Math.min(99, 70 + Math.round(groundH / 20 * 15)),
      nights: days - 1,
      hotel: t.hotel ? { budget: t.hotel[0] * Math.max(1, days-1), mid: t.hotel[1] * Math.max(1, days-1), luxury: t.hotel[2] * Math.max(1, days-1), perNight: t.hotel, nights: Math.max(1, days-1) } : null,
    };
  });
}

// Monthly avg weather per destination [Jan=0 .. Dec=11]
// hi/lo in °F, emoji = weather icon
const WEATHER = {
  "Nashville, TN":      [{hi:48,lo:30,c:"Cold & Cloudy",e:"🌧️"},{hi:53,lo:33,c:"Cool & Rainy",e:"🌦️"},{hi:62,lo:41,c:"Mild",e:"⛅"},{hi:72,lo:50,c:"Pleasant",e:"🌤️"},{hi:80,lo:59,c:"Warm",e:"☀️"},{hi:88,lo:67,c:"Hot & Humid",e:"🌡️"},{hi:92,lo:71,c:"Hot",e:"🔆"},{hi:91,lo:70,c:"Hot",e:"🔆"},{hi:84,lo:63,c:"Warm",e:"☀️"},{hi:73,lo:51,c:"Pleasant",e:"🌤️"},{hi:62,lo:41,c:"Cool",e:"⛅"},{hi:51,lo:33,c:"Cold",e:"🌧️"}],
  "Charleston, SC":     [{hi:57,lo:38,c:"Cool",e:"⛅"},{hi:60,lo:40,c:"Cool",e:"⛅"},{hi:68,lo:47,c:"Mild",e:"🌤️"},{hi:76,lo:55,c:"Warm",e:"☀️"},{hi:83,lo:63,c:"Warm",e:"☀️"},{hi:89,lo:71,c:"Hot & Humid",e:"🌡️"},{hi:91,lo:74,c:"Hot",e:"🔆"},{hi:90,lo:74,c:"Hot",e:"🔆"},{hi:85,lo:68,c:"Warm",e:"☀️"},{hi:76,lo:57,c:"Lovely",e:"🌤️"},{hi:67,lo:47,c:"Mild",e:"⛅"},{hi:59,lo:40,c:"Cool",e:"⛅"}],
  "Savannah, GA":       [{hi:59,lo:39,c:"Cool",e:"⛅"},{hi:63,lo:42,c:"Cool",e:"⛅"},{hi:71,lo:49,c:"Mild",e:"🌤️"},{hi:79,lo:57,c:"Warm",e:"☀️"},{hi:86,lo:65,c:"Warm",e:"☀️"},{hi:91,lo:72,c:"Hot",e:"🌡️"},{hi:93,lo:75,c:"Hot",e:"🔆"},{hi:92,lo:74,c:"Hot",e:"🔆"},{hi:87,lo:69,c:"Warm",e:"☀️"},{hi:79,lo:58,c:"Lovely",e:"🌤️"},{hi:70,lo:49,c:"Mild",e:"⛅"},{hi:61,lo:41,c:"Cool",e:"⛅"}],
  "New Orleans, LA":    [{hi:62,lo:45,c:"Cool & Rainy",e:"🌧️"},{hi:66,lo:48,c:"Cool",e:"⛅"},{hi:73,lo:55,c:"Mild",e:"🌤️"},{hi:80,lo:63,c:"Warm",e:"☀️"},{hi:86,lo:70,c:"Warm",e:"☀️"},{hi:91,lo:76,c:"Hot & Humid",e:"🌡️"},{hi:92,lo:77,c:"Hot",e:"🔆"},{hi:92,lo:77,c:"Hot",e:"🔆"},{hi:88,lo:73,c:"Warm",e:"☀️"},{hi:80,lo:63,c:"Pleasant",e:"🌤️"},{hi:71,lo:54,c:"Mild",e:"⛅"},{hi:64,lo:47,c:"Cool",e:"🌦️"}],
  "Miami, FL":          [{hi:75,lo:60,c:"Sunny & Dry",e:"☀️"},{hi:77,lo:61,c:"Sunny",e:"☀️"},{hi:80,lo:65,c:"Warm",e:"☀️"},{hi:84,lo:69,c:"Warm",e:"☀️"},{hi:88,lo:74,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot & Humid",e:"🌡️"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:90,lo:77,c:"Hot",e:"🔆"},{hi:86,lo:73,c:"Warm",e:"☀️"},{hi:81,lo:68,c:"Warm",e:"☀️"},{hi:76,lo:62,c:"Sunny",e:"☀️"}],
  "Key West, FL":       [{hi:75,lo:65,c:"Sunny",e:"☀️"},{hi:77,lo:66,c:"Sunny",e:"☀️"},{hi:80,lo:69,c:"Warm",e:"☀️"},{hi:84,lo:73,c:"Warm",e:"☀️"},{hi:88,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:79,c:"Hot",e:"🌡️"},{hi:91,lo:80,c:"Hot",e:"🔆"},{hi:91,lo:80,c:"Hot",e:"🔆"},{hi:90,lo:79,c:"Hot",e:"🌡️"},{hi:86,lo:76,c:"Warm",e:"☀️"},{hi:81,lo:71,c:"Warm",e:"☀️"},{hi:77,lo:66,c:"Sunny",e:"☀️"}],
  "Asheville, NC":      [{hi:47,lo:26,c:"Cold",e:"❄️"},{hi:51,lo:28,c:"Cold",e:"❄️"},{hi:60,lo:35,c:"Cool",e:"⛅"},{hi:69,lo:43,c:"Mild",e:"🌤️"},{hi:76,lo:51,c:"Lovely",e:"☀️"},{hi:83,lo:59,c:"Warm",e:"☀️"},{hi:86,lo:63,c:"Warm",e:"☀️"},{hi:85,lo:62,c:"Warm",e:"☀️"},{hi:79,lo:56,c:"Pleasant",e:"🌤️"},{hi:69,lo:44,c:"Crisp",e:"🍂"},{hi:59,lo:35,c:"Cool",e:"⛅"},{hi:49,lo:28,c:"Cold",e:"❄️"}],
  "Chicago, IL":        [{hi:32,lo:18,c:"Freezing",e:"❄️"},{hi:36,lo:22,c:"Freezing",e:"❄️"},{hi:47,lo:31,c:"Cold",e:"🌨️"},{hi:59,lo:41,c:"Cool",e:"⛅"},{hi:70,lo:51,c:"Mild",e:"🌤️"},{hi:80,lo:61,c:"Warm",e:"☀️"},{hi:84,lo:66,c:"Hot",e:"☀️"},{hi:82,lo:65,c:"Warm",e:"☀️"},{hi:75,lo:57,c:"Pleasant",e:"🌤️"},{hi:63,lo:46,c:"Cool",e:"⛅"},{hi:49,lo:35,c:"Cold",e:"🌧️"},{hi:36,lo:23,c:"Freezing",e:"❄️"}],
  "Portland, ME":       [{hi:31,lo:13,c:"Freezing",e:"❄️"},{hi:34,lo:15,c:"Freezing",e:"❄️"},{hi:43,lo:24,c:"Cold",e:"🌨️"},{hi:54,lo:34,c:"Cool",e:"⛅"},{hi:65,lo:44,c:"Mild",e:"🌤️"},{hi:74,lo:53,c:"Lovely",e:"☀️"},{hi:80,lo:59,c:"Warm",e:"☀️"},{hi:78,lo:58,c:"Warm",e:"☀️"},{hi:70,lo:50,c:"Pleasant",e:"🌤️"},{hi:59,lo:40,c:"Crisp",e:"🍂"},{hi:47,lo:31,c:"Cold",e:"🌧️"},{hi:35,lo:19,c:"Freezing",e:"❄️"}],
  "Montreal, QC":       [{hi:23,lo:8,c:"Freezing",e:"❄️"},{hi:26,lo:10,c:"Freezing",e:"❄️"},{hi:37,lo:22,c:"Cold",e:"🌨️"},{hi:52,lo:34,c:"Cool",e:"⛅"},{hi:65,lo:46,c:"Mild",e:"🌤️"},{hi:75,lo:56,c:"Warm",e:"☀️"},{hi:80,lo:61,c:"Warm",e:"☀️"},{hi:78,lo:59,c:"Warm",e:"☀️"},{hi:68,lo:51,c:"Pleasant",e:"🌤️"},{hi:55,lo:40,c:"Cool",e:"🍂"},{hi:41,lo:29,c:"Cold",e:"🌧️"},{hi:28,lo:14,c:"Freezing",e:"❄️"}],
  "Quebec City, QC":    [{hi:19,lo:3,c:"Freezing",e:"❄️"},{hi:22,lo:5,c:"Freezing",e:"❄️"},{hi:33,lo:17,c:"Cold",e:"🌨️"},{hi:48,lo:31,c:"Cool",e:"⛅"},{hi:62,lo:43,c:"Mild",e:"🌤️"},{hi:73,lo:54,c:"Warm",e:"☀️"},{hi:78,lo:59,c:"Warm",e:"☀️"},{hi:75,lo:57,c:"Warm",e:"☀️"},{hi:65,lo:48,c:"Pleasant",e:"🌤️"},{hi:52,lo:38,c:"Crisp",e:"🍂"},{hi:38,lo:27,c:"Cold",e:"🌧️"},{hi:24,lo:9,c:"Freezing",e:"❄️"}],
  "Toronto, ON":        [{hi:28,lo:16,c:"Freezing",e:"❄️"},{hi:30,lo:17,c:"Freezing",e:"❄️"},{hi:40,lo:25,c:"Cold",e:"🌨️"},{hi:54,lo:37,c:"Cool",e:"⛅"},{hi:65,lo:47,c:"Mild",e:"🌤️"},{hi:75,lo:57,c:"Warm",e:"☀️"},{hi:81,lo:63,c:"Warm",e:"☀️"},{hi:79,lo:61,c:"Warm",e:"☀️"},{hi:70,lo:53,c:"Pleasant",e:"🌤️"},{hi:58,lo:43,c:"Cool",e:"🍂"},{hi:45,lo:33,c:"Cold",e:"🌧️"},{hi:33,lo:21,c:"Freezing",e:"❄️"}],
  "Reykjavik":          [{hi:36,lo:28,c:"Cold & Windy",e:"🌬️"},{hi:37,lo:28,c:"Cold",e:"🌬️"},{hi:40,lo:30,c:"Cold",e:"⛅"},{hi:46,lo:35,c:"Cool",e:"⛅"},{hi:53,lo:41,c:"Cool",e:"🌤️"},{hi:59,lo:47,c:"Mild",e:"🌤️"},{hi:63,lo:51,c:"Mild",e:"☀️"},{hi:63,lo:51,c:"Mild",e:"☀️"},{hi:57,lo:46,c:"Cool",e:"⛅"},{hi:49,lo:39,c:"Cool",e:"🌧️"},{hi:42,lo:33,c:"Cold",e:"🌧️"},{hi:37,lo:29,c:"Cold",e:"🌬️"}],
  "London":             [{hi:47,lo:38,c:"Cold & Overcast",e:"🌧️"},{hi:49,lo:38,c:"Cold",e:"🌧️"},{hi:54,lo:41,c:"Cool",e:"⛅"},{hi:60,lo:44,c:"Mild",e:"🌤️"},{hi:67,lo:50,c:"Pleasant",e:"🌤️"},{hi:73,lo:56,c:"Warm",e:"☀️"},{hi:77,lo:60,c:"Warm",e:"☀️"},{hi:76,lo:59,c:"Warm",e:"☀️"},{hi:70,lo:54,c:"Mild",e:"🌤️"},{hi:61,lo:48,c:"Cool",e:"⛅"},{hi:53,lo:43,c:"Cold",e:"🌧️"},{hi:47,lo:38,c:"Cold",e:"🌧️"}],
  "Paris":              [{hi:46,lo:35,c:"Cold & Rainy",e:"🌧️"},{hi:49,lo:36,c:"Cold",e:"🌧️"},{hi:56,lo:41,c:"Cool",e:"⛅"},{hi:62,lo:45,c:"Mild",e:"🌤️"},{hi:69,lo:52,c:"Lovely",e:"🌤️"},{hi:76,lo:58,c:"Warm",e:"☀️"},{hi:81,lo:62,c:"Warm",e:"☀️"},{hi:81,lo:62,c:"Warm",e:"☀️"},{hi:74,lo:56,c:"Pleasant",e:"☀️"},{hi:64,lo:49,c:"Cool",e:"⛅"},{hi:54,lo:42,c:"Cool",e:"🌧️"},{hi:46,lo:36,c:"Cold",e:"🌧️"}],
  "Amsterdam":          [{hi:42,lo:34,c:"Cold & Rainy",e:"🌧️"},{hi:44,lo:34,c:"Cold",e:"🌧️"},{hi:51,lo:38,c:"Cool",e:"⛅"},{hi:57,lo:43,c:"Mild",e:"🌤️"},{hi:65,lo:50,c:"Pleasant",e:"🌤️"},{hi:71,lo:56,c:"Warm",e:"☀️"},{hi:74,lo:59,c:"Warm",e:"☀️"},{hi:73,lo:58,c:"Warm",e:"☀️"},{hi:67,lo:53,c:"Mild",e:"🌤️"},{hi:58,lo:47,c:"Cool",e:"⛅"},{hi:49,lo:40,c:"Cold",e:"🌧️"},{hi:43,lo:35,c:"Cold",e:"🌧️"}],
  "Lisbon":             [{hi:57,lo:46,c:"Mild & Rainy",e:"🌦️"},{hi:59,lo:47,c:"Mild",e:"🌦️"},{hi:63,lo:50,c:"Mild",e:"⛅"},{hi:68,lo:54,c:"Pleasant",e:"🌤️"},{hi:73,lo:58,c:"Warm",e:"☀️"},{hi:80,lo:64,c:"Warm",e:"☀️"},{hi:86,lo:69,c:"Hot & Dry",e:"🔆"},{hi:87,lo:70,c:"Hot",e:"🔆"},{hi:81,lo:65,c:"Warm",e:"☀️"},{hi:72,lo:59,c:"Warm",e:"☀️"},{hi:64,lo:52,c:"Mild",e:"🌦️"},{hi:57,lo:46,c:"Mild",e:"🌧️"}],
  "Barcelona":          [{hi:57,lo:44,c:"Mild",e:"⛅"},{hi:59,lo:45,c:"Mild",e:"⛅"},{hi:64,lo:49,c:"Mild",e:"🌤️"},{hi:69,lo:54,c:"Pleasant",e:"🌤️"},{hi:75,lo:60,c:"Warm",e:"☀️"},{hi:82,lo:67,c:"Hot",e:"☀️"},{hi:88,lo:72,c:"Hot",e:"🔆"},{hi:88,lo:72,c:"Hot",e:"🔆"},{hi:82,lo:67,c:"Warm",e:"☀️"},{hi:73,lo:60,c:"Warm",e:"🌤️"},{hi:64,lo:52,c:"Mild",e:"⛅"},{hi:57,lo:45,c:"Mild",e:"⛅"}],
  "Rome":               [{hi:54,lo:39,c:"Cool & Rainy",e:"🌧️"},{hi:57,lo:41,c:"Cool",e:"⛅"},{hi:63,lo:45,c:"Mild",e:"🌤️"},{hi:69,lo:50,c:"Pleasant",e:"🌤️"},{hi:77,lo:57,c:"Warm",e:"☀️"},{hi:85,lo:64,c:"Hot",e:"☀️"},{hi:90,lo:69,c:"Hot",e:"🔆"},{hi:90,lo:69,c:"Hot",e:"🔆"},{hi:82,lo:63,c:"Warm",e:"☀️"},{hi:73,lo:56,c:"Warm",e:"🌤️"},{hi:62,lo:48,c:"Cool",e:"🌦️"},{hi:54,lo:41,c:"Cool",e:"🌧️"}],
  "Dublin":             [{hi:47,lo:37,c:"Cold & Rainy",e:"🌧️"},{hi:48,lo:37,c:"Cold",e:"🌧️"},{hi:52,lo:39,c:"Cool",e:"🌦️"},{hi:57,lo:42,c:"Cool",e:"⛅"},{hi:63,lo:47,c:"Mild",e:"🌤️"},{hi:69,lo:52,c:"Pleasant",e:"🌤️"},{hi:73,lo:56,c:"Warm",e:"☀️"},{hi:72,lo:56,c:"Warm",e:"☀️"},{hi:66,lo:51,c:"Mild",e:"🌤️"},{hi:58,lo:45,c:"Cool",e:"⛅"},{hi:51,lo:41,c:"Cool",e:"🌧️"},{hi:47,lo:38,c:"Cold",e:"🌧️"}],
  "Edinburgh":          [{hi:43,lo:34,c:"Cold & Rainy",e:"🌧️"},{hi:44,lo:34,c:"Cold",e:"🌧️"},{hi:49,lo:37,c:"Cool",e:"⛅"},{hi:54,lo:40,c:"Cool",e:"⛅"},{hi:60,lo:46,c:"Mild",e:"🌤️"},{hi:66,lo:51,c:"Pleasant",e:"🌤️"},{hi:69,lo:54,c:"Warm",e:"☀️"},{hi:68,lo:54,c:"Warm",e:"☀️"},{hi:63,lo:50,c:"Mild",e:"🌤️"},{hi:56,lo:44,c:"Cool",e:"⛅"},{hi:48,lo:39,c:"Cold",e:"🌧️"},{hi:44,lo:35,c:"Cold",e:"🌧️"}],
  "Copenhagen":         [{hi:37,lo:29,c:"Cold",e:"❄️"},{hi:38,lo:29,c:"Cold",e:"❄️"},{hi:45,lo:34,c:"Cool",e:"⛅"},{hi:53,lo:40,c:"Cool",e:"⛅"},{hi:62,lo:49,c:"Mild",e:"🌤️"},{hi:70,lo:56,c:"Warm",e:"☀️"},{hi:74,lo:60,c:"Warm",e:"☀️"},{hi:73,lo:59,c:"Warm",e:"☀️"},{hi:66,lo:53,c:"Mild",e:"🌤️"},{hi:56,lo:45,c:"Cool",e:"⛅"},{hi:46,lo:38,c:"Cold",e:"🌧️"},{hi:39,lo:32,c:"Cold",e:"❄️"}],
  "Mexico City":        [{hi:70,lo:42,c:"Sunny & Cool Nights",e:"☀️"},{hi:73,lo:44,c:"Sunny",e:"☀️"},{hi:78,lo:47,c:"Warm",e:"☀️"},{hi:81,lo:50,c:"Warm",e:"☀️"},{hi:81,lo:52,c:"Warm",e:"☀️"},{hi:77,lo:54,c:"Mild & Rainy",e:"🌦️"},{hi:74,lo:54,c:"Cloudy",e:"🌧️"},{hi:74,lo:53,c:"Rainy Season",e:"🌧️"},{hi:74,lo:52,c:"Rainy",e:"🌧️"},{hi:74,lo:50,c:"Mild",e:"⛅"},{hi:72,lo:46,c:"Pleasant",e:"🌤️"},{hi:70,lo:43,c:"Sunny",e:"☀️"}],
  "Cancún":             [{hi:84,lo:66,c:"Sunny & Warm",e:"☀️"},{hi:85,lo:67,c:"Sunny",e:"☀️"},{hi:88,lo:70,c:"Warm",e:"☀️"},{hi:91,lo:73,c:"Hot",e:"🌡️"},{hi:92,lo:76,c:"Hot",e:"🌡️"},{hi:92,lo:78,c:"Hot & Humid",e:"🌡️"},{hi:92,lo:78,c:"Hot",e:"🔆"},{hi:92,lo:78,c:"Hot",e:"🔆"},{hi:91,lo:77,c:"Hot",e:"🔆"},{hi:89,lo:74,c:"Warm",e:"☀️"},{hi:86,lo:71,c:"Warm",e:"☀️"},{hi:84,lo:67,c:"Sunny",e:"☀️"}],
  "Havana":             [{hi:79,lo:65,c:"Sunny & Dry",e:"☀️"},{hi:80,lo:65,c:"Sunny",e:"☀️"},{hi:83,lo:67,c:"Warm",e:"☀️"},{hi:85,lo:69,c:"Warm",e:"☀️"},{hi:88,lo:72,c:"Hot",e:"🌡️"},{hi:90,lo:74,c:"Hot & Humid",e:"🌡️"},{hi:91,lo:75,c:"Hot",e:"🔆"},{hi:91,lo:76,c:"Hot",e:"🔆"},{hi:90,lo:74,c:"Hot",e:"🌡️"},{hi:87,lo:72,c:"Warm",e:"☀️"},{hi:83,lo:69,c:"Warm",e:"☀️"},{hi:80,lo:66,c:"Sunny",e:"☀️"}],
  "San José, Costa Rica":[{hi:84,lo:58,c:"Dry Season",e:"☀️"},{hi:85,lo:58,c:"Dry & Sunny",e:"☀️"},{hi:87,lo:60,c:"Warm",e:"☀️"},{hi:88,lo:62,c:"Warm",e:"☀️"},{hi:85,lo:63,c:"Warm",e:"🌦️"},{hi:81,lo:63,c:"Rainy Season",e:"🌧️"},{hi:80,lo:62,c:"Rainy",e:"🌧️"},{hi:80,lo:62,c:"Rainy",e:"🌧️"},{hi:81,lo:62,c:"Rainy",e:"🌧️"},{hi:82,lo:62,c:"Rainy",e:"🌧️"},{hi:82,lo:61,c:"Rainy",e:"🌧️"},{hi:83,lo:59,c:"Dry Season Starts",e:"⛅"}],
  "Cartagena":          [{hi:88,lo:75,c:"Hot & Sunny",e:"☀️"},{hi:89,lo:75,c:"Hot",e:"☀️"},{hi:90,lo:76,c:"Hot",e:"🌡️"},{hi:91,lo:77,c:"Hot",e:"🌡️"},{hi:91,lo:77,c:"Hot & Humid",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Warm",e:"🌦️"},{hi:89,lo:76,c:"Warm",e:"⛅"},{hi:88,lo:75,c:"Hot & Sunny",e:"☀️"}],
  "Tokyo":              [{hi:48,lo:33,c:"Cold & Dry",e:"❄️"},{hi:50,lo:34,c:"Cold",e:"❄️"},{hi:57,lo:41,c:"Cool",e:"🌸"},{hi:66,lo:50,c:"Mild",e:"🌸"},{hi:73,lo:58,c:"Warm",e:"🌤️"},{hi:78,lo:65,c:"Rainy Season",e:"🌧️"},{hi:86,lo:72,c:"Hot & Humid",e:"🌡️"},{hi:88,lo:74,c:"Hot",e:"🔆"},{hi:81,lo:68,c:"Warm",e:"☀️"},{hi:70,lo:56,c:"Pleasant",e:"🍂"},{hi:60,lo:46,c:"Cool",e:"⛅"},{hi:51,lo:36,c:"Cold",e:"❄️"}],
  "Seoul":              [{hi:35,lo:19,c:"Freezing",e:"❄️"},{hi:40,lo:23,c:"Cold",e:"❄️"},{hi:52,lo:33,c:"Cool",e:"⛅"},{hi:64,lo:44,c:"Mild",e:"🌸"},{hi:73,lo:54,c:"Warm",e:"🌤️"},{hi:81,lo:63,c:"Warm & Rainy",e:"🌧️"},{hi:86,lo:71,c:"Hot & Humid",e:"🌡️"},{hi:87,lo:73,c:"Hot",e:"🌡️"},{hi:78,lo:63,c:"Pleasant",e:"🌤️"},{hi:66,lo:50,c:"Cool",e:"🍂"},{hi:52,lo:36,c:"Cold",e:"⛅"},{hi:38,lo:23,c:"Freezing",e:"❄️"}],
  "Bangkok":            [{hi:93,lo:70,c:"Hot & Dry",e:"☀️"},{hi:96,lo:73,c:"Hot",e:"☀️"},{hi:99,lo:77,c:"Very Hot",e:"🔆"},{hi:100,lo:80,c:"Scorching",e:"🔆"},{hi:95,lo:79,c:"Hot & Humid",e:"🌡️"},{hi:91,lo:78,c:"Rainy Season",e:"🌧️"},{hi:90,lo:77,c:"Rainy",e:"🌧️"},{hi:90,lo:77,c:"Rainy",e:"🌧️"},{hi:90,lo:77,c:"Rainy",e:"🌧️"},{hi:90,lo:76,c:"Rainy",e:"🌧️"},{hi:92,lo:74,c:"Hot",e:"⛅"},{hi:92,lo:71,c:"Hot & Dry",e:"☀️"}],
  "Medellín":           [{hi:80,lo:59,c:"Mild & Sunny",e:"☀️"},{hi:81,lo:60,c:"Mild",e:"🌤️"},{hi:81,lo:61,c:"Warm",e:"🌦️"},{hi:80,lo:61,c:"Rainy",e:"🌧️"},{hi:79,lo:60,c:"Rainy",e:"🌧️"},{hi:80,lo:60,c:"Mild",e:"⛅"},{hi:80,lo:58,c:"Mild & Dry",e:"☀️"},{hi:80,lo:58,c:"Sunny",e:"☀️"},{hi:80,lo:59,c:"Mild",e:"🌦️"},{hi:79,lo:59,c:"Rainy",e:"🌧️"},{hi:79,lo:59,c:"Rainy",e:"🌧️"},{hi:79,lo:58,c:"Mild",e:"⛅"}],
  "Oaxaca":             [{hi:79,lo:46,c:"Sunny & Cool Nights",e:"☀️"},{hi:82,lo:48,c:"Warm",e:"☀️"},{hi:86,lo:52,c:"Warm",e:"☀️"},{hi:88,lo:55,c:"Hot",e:"☀️"},{hi:87,lo:58,c:"Hot",e:"☀️"},{hi:81,lo:58,c:"Rainy Season",e:"🌧️"},{hi:78,lo:58,c:"Rainy",e:"🌧️"},{hi:78,lo:58,c:"Rainy",e:"🌧️"},{hi:79,lo:57,c:"Rainy",e:"🌧️"},{hi:80,lo:54,c:"Mild",e:"⛅"},{hi:80,lo:50,c:"Warm",e:"🌤️"},{hi:79,lo:46,c:"Sunny",e:"☀️"}],
  "San Juan, PR":       [{hi:83,lo:70,c:"Warm & Sunny",e:"☀️"},{hi:84,lo:70,c:"Warm",e:"☀️"},{hi:85,lo:71,c:"Warm",e:"☀️"},{hi:87,lo:73,c:"Hot",e:"🌡️"},{hi:88,lo:75,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:90,lo:78,c:"Hot",e:"🌡️"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:90,lo:77,c:"Warm",e:"🌦️"},{hi:87,lo:75,c:"Warm",e:"⛅"},{hi:84,lo:71,c:"Warm",e:"☀️"}],
  "Marrakech":          [{hi:63,lo:40,c:"Cool & Sunny",e:"🌤️"},{hi:67,lo:43,c:"Mild",e:"🌤️"},{hi:73,lo:48,c:"Warm",e:"☀️"},{hi:79,lo:54,c:"Warm",e:"☀️"},{hi:86,lo:60,c:"Hot",e:"☀️"},{hi:96,lo:68,c:"Very Hot",e:"🔆"},{hi:103,lo:74,c:"Scorching",e:"🔆"},{hi:102,lo:73,c:"Scorching",e:"🔆"},{hi:93,lo:66,c:"Hot",e:"☀️"},{hi:82,lo:57,c:"Warm",e:"☀️"},{hi:71,lo:48,c:"Mild",e:"🌤️"},{hi:63,lo:41,c:"Cool",e:"🌤️"}],
  "Cape Town":          [{hi:79,lo:63,c:"Sunny & Warm",e:"☀️"},{hi:79,lo:63,c:"Warm",e:"☀️"},{hi:74,lo:59,c:"Warm",e:"☀️"},{hi:68,lo:55,c:"Mild",e:"🌤️"},{hi:63,lo:51,c:"Mild",e:"⛅"},{hi:57,lo:47,c:"Cool & Rainy",e:"🌧️"},{hi:57,lo:47,c:"Cool",e:"🌧️"},{hi:58,lo:47,c:"Cool",e:"🌧️"},{hi:62,lo:50,c:"Mild",e:"⛅"},{hi:67,lo:54,c:"Pleasant",e:"🌤️"},{hi:72,lo:58,c:"Warm",e:"☀️"},{hi:77,lo:61,c:"Warm",e:"☀️"}],
  "Bogotá":             [{hi:65,lo:43,c:"Mild",e:"⛅"},{hi:65,lo:44,c:"Rainy",e:"🌧️"},{hi:65,lo:45,c:"Rainy",e:"🌧️"},{hi:64,lo:45,c:"Rainy",e:"🌧️"},{hi:63,lo:44,c:"Rainy",e:"🌧️"},{hi:63,lo:43,c:"Mild",e:"⛅"},{hi:63,lo:42,c:"Dry Season",e:"☀️"},{hi:64,lo:42,c:"Sunny",e:"☀️"},{hi:64,lo:43,c:"Mild",e:"🌤️"},{hi:63,lo:43,c:"Rainy",e:"🌧️"},{hi:63,lo:43,c:"Rainy",e:"🌧️"},{hi:64,lo:43,c:"Mild",e:"⛅"}],
  "Nassau, Bahamas":    [{hi:77,lo:65,c:"Sunny & Mild",e:"☀️"},{hi:77,lo:65,c:"Sunny",e:"☀️"},{hi:80,lo:67,c:"Warm",e:"☀️"},{hi:83,lo:70,c:"Warm",e:"☀️"},{hi:87,lo:74,c:"Hot",e:"🌡️"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:91,lo:78,c:"Hot",e:"🔆"},{hi:90,lo:77,c:"Hot",e:"🌡️"},{hi:86,lo:74,c:"Warm",e:"☀️"},{hi:82,lo:70,c:"Warm",e:"☀️"},{hi:78,lo:66,c:"Sunny",e:"☀️"}],
  "Punta Cana":         [{hi:84,lo:69,c:"Sunny",e:"☀️"},{hi:84,lo:69,c:"Sunny",e:"☀️"},{hi:86,lo:70,c:"Warm",e:"☀️"},{hi:88,lo:72,c:"Hot",e:"🌡️"},{hi:89,lo:74,c:"Hot",e:"🌡️"},{hi:90,lo:75,c:"Hot",e:"🌡️"},{hi:91,lo:76,c:"Hot",e:"🔆"},{hi:91,lo:76,c:"Hot",e:"🔆"},{hi:90,lo:75,c:"Hot",e:"🌡️"},{hi:88,lo:74,c:"Warm",e:"🌦️"},{hi:86,lo:72,c:"Warm",e:"⛅"},{hi:84,lo:70,c:"Sunny",e:"☀️"}],
  "Vancouver, BC":      [{hi:43,lo:34,c:"Cold & Rainy",e:"🌧️"},{hi:47,lo:35,c:"Cool & Rainy",e:"🌧️"},{hi:52,lo:38,c:"Cool",e:"🌦️"},{hi:58,lo:43,c:"Mild",e:"🌤️"},{hi:65,lo:49,c:"Mild",e:"🌤️"},{hi:70,lo:54,c:"Warm",e:"☀️"},{hi:76,lo:59,c:"Warm",e:"☀️"},{hi:76,lo:59,c:"Warm",e:"☀️"},{hi:69,lo:53,c:"Mild",e:"🌤️"},{hi:58,lo:46,c:"Cool",e:"🌦️"},{hi:49,lo:39,c:"Cool",e:"🌧️"},{hi:43,lo:35,c:"Cold",e:"🌧️"}],
  "Portland, OR":       [{hi:46,lo:35,c:"Cold & Rainy",e:"🌧️"},{hi:50,lo:37,c:"Cool & Rainy",e:"🌧️"},{hi:56,lo:39,c:"Cool",e:"🌦️"},{hi:61,lo:43,c:"Mild",e:"🌤️"},{hi:67,lo:48,c:"Mild",e:"🌤️"},{hi:74,lo:54,c:"Warm",e:"☀️"},{hi:81,lo:59,c:"Warm",e:"☀️"},{hi:81,lo:59,c:"Warm",e:"☀️"},{hi:74,lo:54,c:"Lovely",e:"☀️"},{hi:62,lo:46,c:"Cool",e:"🌦️"},{hi:51,lo:40,c:"Rainy",e:"🌧️"},{hi:45,lo:35,c:"Cold",e:"🌧️"}],
  "San Diego, CA":      [{hi:65,lo:48,c:"Mild & Sunny",e:"☀️"},{hi:66,lo:50,c:"Mild",e:"☀️"},{hi:68,lo:53,c:"Mild",e:"☀️"},{hi:71,lo:56,c:"Warm",e:"☀️"},{hi:73,lo:60,c:"Warm",e:"☀️"},{hi:77,lo:64,c:"Warm",e:"☀️"},{hi:82,lo:68,c:"Hot",e:"🌡️"},{hi:83,lo:69,c:"Hot",e:"🌡️"},{hi:81,lo:67,c:"Warm",e:"☀️"},{hi:76,lo:62,c:"Warm",e:"☀️"},{hi:70,lo:54,c:"Mild",e:"☀️"},{hi:65,lo:49,c:"Mild",e:"☀️"}],
  "Sedona, AZ":         [{hi:55,lo:32,c:"Cool & Sunny",e:"☀️"},{hi:59,lo:35,c:"Cool",e:"☀️"},{hi:66,lo:40,c:"Mild",e:"☀️"},{hi:74,lo:47,c:"Warm",e:"☀️"},{hi:83,lo:55,c:"Hot",e:"☀️"},{hi:92,lo:63,c:"Very Hot",e:"🔆"},{hi:96,lo:68,c:"Scorching",e:"🔆"},{hi:93,lo:67,c:"Hot",e:"🔆"},{hi:88,lo:62,c:"Hot",e:"☀️"},{hi:77,lo:51,c:"Warm",e:"☀️"},{hi:64,lo:40,c:"Mild",e:"☀️"},{hi:55,lo:32,c:"Cool",e:"☀️"}],
  "Honolulu, HI":       [{hi:80,lo:66,c:"Warm & Breezy",e:"🌺"},{hi:80,lo:66,c:"Warm",e:"🌺"},{hi:81,lo:67,c:"Warm",e:"☀️"},{hi:83,lo:69,c:"Warm",e:"☀️"},{hi:85,lo:71,c:"Hot",e:"☀️"},{hi:87,lo:73,c:"Hot",e:"🌡️"},{hi:89,lo:75,c:"Hot",e:"🌡️"},{hi:89,lo:76,c:"Hot",e:"🌡️"},{hi:89,lo:75,c:"Hot",e:"🌡️"},{hi:87,lo:73,c:"Warm",e:"☀️"},{hi:84,lo:71,c:"Warm",e:"☀️"},{hi:81,lo:67,c:"Warm",e:"🌺"}],
  "Cabo San Lucas":     [{hi:78,lo:56,c:"Warm & Sunny",e:"☀️"},{hi:79,lo:57,c:"Warm",e:"☀️"},{hi:82,lo:59,c:"Warm",e:"☀️"},{hi:86,lo:62,c:"Hot",e:"☀️"},{hi:90,lo:66,c:"Hot",e:"☀️"},{hi:94,lo:72,c:"Very Hot",e:"🔆"},{hi:97,lo:77,c:"Scorching",e:"🔆"},{hi:98,lo:79,c:"Scorching",e:"🔆"},{hi:95,lo:77,c:"Hot",e:"🔆"},{hi:90,lo:72,c:"Hot",e:"☀️"},{hi:84,lo:64,c:"Warm",e:"☀️"},{hi:79,lo:57,c:"Warm",e:"☀️"}],
  "Puerto Vallarta":    [{hi:82,lo:60,c:"Warm & Sunny",e:"☀️"},{hi:83,lo:60,c:"Warm",e:"☀️"},{hi:85,lo:62,c:"Warm",e:"☀️"},{hi:88,lo:65,c:"Hot",e:"☀️"},{hi:91,lo:69,c:"Hot",e:"☀️"},{hi:92,lo:74,c:"Hot & Humid",e:"🌡️"},{hi:92,lo:77,c:"Hot & Rainy",e:"🌧️"},{hi:91,lo:77,c:"Rainy Season",e:"🌧️"},{hi:91,lo:76,c:"Rainy",e:"🌧️"},{hi:91,lo:73,c:"Warm",e:"🌦️"},{hi:88,lo:67,c:"Warm",e:"☀️"},{hi:83,lo:61,c:"Warm",e:"☀️"}],
};

function getWeather(city, dateStr) {
  const w = WEATHER[city];
  if (!w || !dateStr) return null;
  const month = new Date(dateStr + "T12:00:00").getMonth();
  return w[month];
}

const EXPERIENCES = {
  "Nashville, TN": [
    {name:"Honky-tonk bar crawl on Broadway",emoji:"🎸",cat:"nightlife",price:"Free",dur:"Evening",wow:false},
    {name:"Hot chicken taste-off: Prince's vs Hattie B's",emoji:"🍗",cat:"food",price:"$15",dur:"1h",wow:false},
    {name:"Bluebird Cafe songwriter showcase",emoji:"🎵",cat:"culture",price:"$20",dur:"2h",wow:true},
    {name:"Ryman Auditorium backstage tour",emoji:"🏛️",cat:"culture",price:"$30",dur:"1h",wow:false},
    {name:"Pedal tavern tour of downtown",emoji:"🚲",cat:"nightlife",price:"$35",dur:"1.5h",wow:false}
  ],
  "Charleston, SC": [
    {name:"Ghost tour of the historic district",emoji:"👻",cat:"culture",price:"$25",dur:"2h",wow:false},
    {name:"Sunset sail on Charleston Harbor",emoji:"⛵",cat:"nature",price:"$45",dur:"2h",wow:true},
    {name:"Magnolia Plantation and Gardens",emoji:"🌺",cat:"nature",price:"$20",dur:"3h",wow:false},
    {name:"She-crab soup & shrimp & grits food tour",emoji:"🦀",cat:"food",price:"$65",dur:"3h",wow:false},
    {name:"Kayak through the salt marshes",emoji:"🚣",cat:"adventure",price:"$55",dur:"2h",wow:false}
  ],
  "Savannah, GA": [
    {name:"Midnight in the Garden walking tour",emoji:"📖",cat:"culture",price:"$20",dur:"2h",wow:false},
    {name:"Kayak the marshes at sunset",emoji:"🚣",cat:"nature",price:"$50",dur:"2h",wow:true},
    {name:"Trolley tour of 22 historic squares",emoji:"🚃",cat:"culture",price:"$25",dur:"1.5h",wow:false},
    {name:"Leopold's Ice Cream (since 1919)",emoji:"🍦",cat:"food",price:"$8",dur:"30m",wow:false},
    {name:"Ghost & Gravestones haunted tour",emoji:"👻",cat:"culture",price:"$30",dur:"2h",wow:false}
  ],
  "New Orleans, LA": [
    {name:"Jazz on Frenchmen Street at night",emoji:"🎷",cat:"nightlife",price:"Free",dur:"Evening",wow:true},
    {name:"Swamp tour with alligators & cypress trees",emoji:"🐊",cat:"nature",price:"$45",dur:"2h",wow:true},
    {name:"Cooking class: gumbo & beignets",emoji:"👨‍🍳",cat:"food",price:"$80",dur:"3h",wow:false},
    {name:"Cemetery voodoo history walking tour",emoji:"☠️",cat:"culture",price:"$25",dur:"1.5h",wow:false},
    {name:"Plantation River cruise",emoji:"🚢",cat:"culture",price:"$35",dur:"2h",wow:false}
  ],
  "Miami, FL": [
    {name:"Wynwood Walls street art guided walk",emoji:"🎨",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Sunset cruise on Biscayne Bay",emoji:"🌅",cat:"nature",price:"$55",dur:"2h",wow:true},
    {name:"Little Havana walking food tour",emoji:"🥖",cat:"food",price:"$65",dur:"2.5h",wow:false},
    {name:"Art Deco architecture walking tour",emoji:"🏛️",cat:"culture",price:"$25",dur:"1.5h",wow:false},
    {name:"Snorkeling at Biscayne National Park",emoji:"🤿",cat:"adventure",price:"$35",dur:"3h",wow:false}
  ],
  "Key West, FL": [
    {name:"Bioluminescent kayak tour at night",emoji:"✨",cat:"nature",price:"$65",dur:"2h",wow:true},
    {name:"Snorkeling the only living US coral reef",emoji:"🐠",cat:"adventure",price:"$50",dur:"3h",wow:true},
    {name:"Sunset celebration at Mallory Square",emoji:"🌅",cat:"culture",price:"Free",dur:"1h",wow:false},
    {name:"Hemingway Home & six-toed cats",emoji:"🐱",cat:"culture",price:"$16",dur:"1h",wow:false},
    {name:"Parasailing over the Gulf",emoji:"🪂",cat:"adventure",price:"$85",dur:"1h",wow:false}
  ],
  "Asheville, NC": [
    {name:"Blue Ridge Parkway sunrise drive",emoji:"🌄",cat:"nature",price:"Free",dur:"2h",wow:true},
    {name:"Biltmore Estate wine tasting",emoji:"🍷",cat:"culture",price:"$65",dur:"2h",wow:false},
    {name:"Craft brewery crawl (50+ breweries)",emoji:"🍺",cat:"food",price:"$40",dur:"3h",wow:false},
    {name:"Whitewater rafting on the French Broad",emoji:"🚣",cat:"adventure",price:"$55",dur:"3h",wow:false},
    {name:"River Arts District studio walk",emoji:"🎨",cat:"culture",price:"Free",dur:"2h",wow:false}
  ],
  "Chicago, IL": [
    {name:"Architecture boat tour on the Chicago River",emoji:"🏛️",cat:"culture",price:"$50",dur:"1.5h",wow:true},
    {name:"Deep dish pizza making class",emoji:"🍕",cat:"food",price:"$70",dur:"2h",wow:false},
    {name:"Blues club night in Bronzeville",emoji:"🎵",cat:"nightlife",price:"$15",dur:"Evening",wow:false},
    {name:"360 Chicago observation deck at sunset",emoji:"🌆",cat:"culture",price:"$30",dur:"1h",wow:false},
    {name:"Millennium Park & Cloud Gate",emoji:"🫙",cat:"culture",price:"Free",dur:"1h",wow:false}
  ],
  "Portland, ME": [
    {name:"Lobster boat tour & catch your own",emoji:"🦞",cat:"food",price:"$65",dur:"2h",wow:true},
    {name:"Portland Head Light lighthouse walk",emoji:"🏮",cat:"nature",price:"Free",dur:"1.5h",wow:false},
    {name:"Old Port food & drink walking tour",emoji:"🍽️",cat:"food",price:"$55",dur:"2h",wow:false},
    {name:"Kayak Casco Bay islands",emoji:"🚣",cat:"adventure",price:"$50",dur:"3h",wow:false},
    {name:"L.L.Bean flagship store (open 24/7)",emoji:"🥾",cat:"culture",price:"Free",dur:"1h",wow:false}
  ],
  "Montreal, QC": [
    {name:"Underground City tunnel walk in winter",emoji:"🏙️",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"St-Viateur Bagel fresh from the wood oven",emoji:"🥯",cat:"food",price:"$5",dur:"30m",wow:true},
    {name:"Mont Royal hike to the summit cross",emoji:"⛰️",cat:"nature",price:"Free",dur:"2h",wow:false},
    {name:"Old Montreal evening food tour",emoji:"🥘",cat:"food",price:"$70",dur:"3h",wow:false},
    {name:"Cirque du Soleil HQ guided tour",emoji:"🎪",cat:"culture",price:"$20",dur:"1h",wow:true}
  ],
  "Quebec City, QC": [
    {name:"Toboggan slide down Dufferin Terrace (winter)",emoji:"🛷",cat:"adventure",price:"$3",dur:"30m",wow:true},
    {name:"Ice Hotel overnight stay (Jan-Mar)",emoji:"🏨",cat:"unique",price:"$400",dur:"Night",wow:true},
    {name:"Old City walls walk at dusk",emoji:"🏰",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Maple sugar shack feast in the countryside",emoji:"🍁",cat:"food",price:"$35",dur:"2h",wow:true},
    {name:"Chateau Frontenac afternoon tea",emoji:"☕",cat:"food",price:"$45",dur:"1.5h",wow:false}
  ],
  "Toronto, ON": [
    {name:"CN Tower EdgeWalk outside the tower",emoji:"🏗️",cat:"adventure",price:"$195",dur:"1.5h",wow:true},
    {name:"Kensington Market food crawl",emoji:"🌮",cat:"food",price:"$30",dur:"2h",wow:false},
    {name:"Distillery District Christmas Market",emoji:"🎄",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Ferry to Toronto Islands for city views",emoji:"⛴️",cat:"nature",price:"$8",dur:"2h",wow:false},
    {name:"ROM Bat Cave and dinosaur gallery",emoji:"🦇",cat:"culture",price:"$23",dur:"2h",wow:false}
  ],
  "Reykjavik": [
    {name:"Northern Lights hunt by minibus",emoji:"🌌",cat:"nature",price:"$80",dur:"4h",wow:true},
    {name:"Blue Lagoon geothermal soak",emoji:"♨️",cat:"wellness",price:"$100",dur:"3h",wow:true},
    {name:"Golden Circle: geysers, waterfalls, tectonic plates",emoji:"🌋",cat:"nature",price:"$70",dur:"8h",wow:true},
    {name:"Whale watching in Faxafloi Bay",emoji:"🐋",cat:"nature",price:"$85",dur:"3h",wow:true},
    {name:"Midnight sun walk along the harbor (summer)",emoji:"☀️",cat:"nature",price:"Free",dur:"2h",wow:true}
  ],
  "London": [
    {name:"Tower of London Crown Jewels & ravens",emoji:"👑",cat:"culture",price:"$35",dur:"2.5h",wow:false},
    {name:"Borough Market gourmet food crawl",emoji:"🧀",cat:"food",price:"$20",dur:"2h",wow:false},
    {name:"Thames riverboat at sunset",emoji:"🚢",cat:"nature",price:"$20",dur:"1h",wow:false},
    {name:"Jack the Ripper walking tour in Whitechapel",emoji:"🔦",cat:"culture",price:"$18",dur:"2h",wow:false},
    {name:"Hidden speakeasy cocktail bar experience",emoji:"🍸",cat:"nightlife",price:"$40",dur:"2h",wow:true}
  ],
  "Paris": [
    {name:"Champagne & macarons at Laduree",emoji:"🥂",cat:"food",price:"$30",dur:"1h",wow:false},
    {name:"Evening Seine cruise past lit monuments",emoji:"🌉",cat:"culture",price:"$20",dur:"1h",wow:true},
    {name:"The Catacombs: 6 million skulls underground",emoji:"💀",cat:"unique",price:"$30",dur:"1.5h",wow:true},
    {name:"Sunrise at Sacre-Coeur before the crowds",emoji:"🌅",cat:"culture",price:"Free",dur:"1h",wow:true},
    {name:"French cooking class in a Parisian kitchen",emoji:"👨‍🍳",cat:"food",price:"$120",dur:"3h",wow:false}
  ],
  "Amsterdam": [
    {name:"Canal bike through the Jordaan neighborhood",emoji:"🚲",cat:"culture",price:"$15",dur:"2h",wow:true},
    {name:"Rijksmuseum Rembrandt & Vermeer masterworks",emoji:"🖼️",cat:"culture",price:"$22",dur:"2.5h",wow:false},
    {name:"Heineken brewery experience & tasting",emoji:"🍺",cat:"food",price:"$23",dur:"1.5h",wow:false},
    {name:"Keukenhof tulip gardens in spring",emoji:"🌷",cat:"nature",price:"$20",dur:"3h",wow:true},
    {name:"Anne Frank House (book ahead!)",emoji:"📓",cat:"culture",price:"$16",dur:"1.5h",wow:false}
  ],
  "Lisbon": [
    {name:"Fado music dinner in Alfama",emoji:"🎶",cat:"culture",price:"$50",dur:"3h",wow:true},
    {name:"Sintra fairytale palaces day trip",emoji:"🏰",cat:"culture",price:"$35",dur:"5h",wow:true},
    {name:"Pasteis de Belem: world's best custard tarts",emoji:"🥐",cat:"food",price:"$5",dur:"30m",wow:true},
    {name:"Tram 28 scenic ride through historic hills",emoji:"🚃",cat:"culture",price:"$3",dur:"45m",wow:false},
    {name:"Sunset at Miradouro da Graca viewpoint",emoji:"🌅",cat:"nature",price:"Free",dur:"1h",wow:false}
  ],
  "Barcelona": [
    {name:"Sagrada Familia tower climb at sunrise",emoji:"⛪",cat:"culture",price:"$35",dur:"2h",wow:true},
    {name:"La Boqueria market tapas & sangria",emoji:"🥘",cat:"food",price:"$25",dur:"1.5h",wow:false},
    {name:"Flamenco show in El Born",emoji:"💃",cat:"culture",price:"$40",dur:"1.5h",wow:true},
    {name:"Park Guell mosaic terraces",emoji:"🦎",cat:"culture",price:"$12",dur:"2h",wow:false},
    {name:"Barceloneta beach to bar crawl",emoji:"🏖️",cat:"nightlife",price:"Free",dur:"Evening",wow:false}
  ],
  "Rome": [
    {name:"Vatican Museums & Sistine Chapel (skip the line)",emoji:"🎨",cat:"culture",price:"$25",dur:"3h",wow:true},
    {name:"Trastevere sunset aperitivo bar crawl",emoji:"🍷",cat:"food",price:"$30",dur:"3h",wow:false},
    {name:"Colosseum underground & arena floor access",emoji:"🏛️",cat:"culture",price:"$22",dur:"2h",wow:true},
    {name:"Gelato making class with a local chef",emoji:"🍦",cat:"food",price:"$65",dur:"2h",wow:false},
    {name:"Borghese Gallery (must book ahead)",emoji:"🖼️",cat:"culture",price:"$15",dur:"2h",wow:false}
  ],
  "Dublin": [
    {name:"Guinness Storehouse: pint with a view",emoji:"🍺",cat:"food",price:"$28",dur:"2h",wow:false},
    {name:"Howth cliffside walk & fresh seafood",emoji:"🦐",cat:"nature",price:"Free",dur:"3h",wow:true},
    {name:"Traditional Irish music session pub hop",emoji:"🎻",cat:"nightlife",price:"Free",dur:"Evening",wow:true},
    {name:"Book of Kells at Trinity College",emoji:"📜",cat:"culture",price:"$18",dur:"1.5h",wow:false},
    {name:"Wicklow Mountains & Glendalough monastery",emoji:"⛰️",cat:"nature",price:"$35",dur:"5h",wow:false}
  ],
  "Edinburgh": [
    {name:"Arthur's Seat volcano sunrise hike",emoji:"🌋",cat:"adventure",price:"Free",dur:"2h",wow:true},
    {name:"Scotch whisky tasting on the Royal Mile",emoji:"🥃",cat:"food",price:"$30",dur:"1.5h",wow:false},
    {name:"Edinburgh Castle Crown Jewels tour",emoji:"🏰",cat:"culture",price:"$18",dur:"2h",wow:false},
    {name:"Underground vaults ghost tour",emoji:"👻",cat:"unique",price:"$20",dur:"1.5h",wow:true},
    {name:"Haggis & neeps dinner at a local pub",emoji:"🍽️",cat:"food",price:"$20",dur:"1h",wow:false}
  ],
  "Copenhagen": [
    {name:"Nyhavn canal bar hop & sm\u00f8rrebr\u00f8d lunch",emoji:"🌈",cat:"food",price:"$40",dur:"2h",wow:false},
    {name:"Tivoli Gardens rides & illuminations at night",emoji:"🎡",cat:"culture",price:"$20",dur:"3h",wow:true},
    {name:"Noma tasting menu (book 3 months ahead)",emoji:"🍴",cat:"food",price:"$350",dur:"3h",wow:true},
    {name:"Kayak tour through Copenhagen's canals",emoji:"🚣",cat:"adventure",price:"$35",dur:"2h",wow:false},
    {name:"Louisiana Museum of Modern Art",emoji:"🎨",cat:"culture",price:"$25",dur:"2h",wow:false}
  ],
  "Mexico City": [
    {name:"Teotihuacan: climb the Pyramid of the Sun",emoji:"🔺",cat:"culture",price:"$5",dur:"4h",wow:true},
    {name:"Xochimilco flower barge canal ride",emoji:"🌸",cat:"unique",price:"$20",dur:"2h",wow:true},
    {name:"Lucha libre wrestling show",emoji:"🤼",cat:"culture",price:"$15",dur:"2h",wow:true},
    {name:"Frida Kahlo Museum: Casa Azul",emoji:"🎨",cat:"culture",price:"$12",dur:"2h",wow:false},
    {name:"La Merced street food deep dive",emoji:"🌮",cat:"food",price:"$10",dur:"2h",wow:false}
  ],
  "Cancun": [
    {name:"Swim in a cenote: underground crystal cave",emoji:"💎",cat:"nature",price:"$25",dur:"3h",wow:true},
    {name:"Tulum Mayan ruins overlooking the sea",emoji:"🏛️",cat:"culture",price:"$5",dur:"3h",wow:true},
    {name:"Snorkeling the Mesoamerican Barrier Reef",emoji:"🐠",cat:"adventure",price:"$55",dur:"3h",wow:true},
    {name:"Isla Mujeres day trip by ferry",emoji:"⛴️",cat:"nature",price:"$25",dur:"5h",wow:false},
    {name:"Sunset catamaran party cruise",emoji:"⛵",cat:"nightlife",price:"$65",dur:"3h",wow:false}
  ],
  "Havana": [
    {name:"1950s classic car tour of Havana",emoji:"🚗",cat:"culture",price:"$30",dur:"2h",wow:true},
    {name:"Mojito masterclass at La Bodeguita del Medio",emoji:"🍹",cat:"food",price:"$25",dur:"1h",wow:true},
    {name:"Live salsa show at the Buena Vista Social Club",emoji:"💃",cat:"culture",price:"$20",dur:"2h",wow:true},
    {name:"Malecon sunset walk with locals",emoji:"🌅",cat:"culture",price:"Free",dur:"1.5h",wow:false},
    {name:"Fabrica de Arte Cubano art & music venue",emoji:"🎭",cat:"nightlife",price:"$3",dur:"Evening",wow:false}
  ],
  "San Jose, Costa Rica": [
    {name:"Cloud forest zip-lining at Monteverde",emoji:"🌿",cat:"adventure",price:"$80",dur:"4h",wow:true},
    {name:"Arenal Volcano hot springs at dusk",emoji:"♨️",cat:"wellness",price:"$40",dur:"2h",wow:true},
    {name:"Sloth sanctuary guided tour",emoji:"🦥",cat:"nature",price:"$30",dur:"2h",wow:true},
    {name:"White water rafting the Pacuare River",emoji:"🚣",cat:"adventure",price:"$95",dur:"5h",wow:true},
    {name:"Coffee plantation tour & cupping",emoji:"☕",cat:"food",price:"$25",dur:"2h",wow:false}
  ],
  "Cartagena": [
    {name:"Rosario Islands snorkeling day trip",emoji:"🐠",cat:"adventure",price:"$55",dur:"6h",wow:true},
    {name:"Walled city sunset walking tour",emoji:"🏰",cat:"culture",price:"$20",dur:"2h",wow:false},
    {name:"Palenque village Afro-Colombian culture tour",emoji:"🥁",cat:"culture",price:"$40",dur:"4h",wow:true},
    {name:"Rooftop cocktail bar in Getsemani",emoji:"🍸",cat:"nightlife",price:"$20",dur:"2h",wow:false},
    {name:"Chiva party bus through the old city",emoji:"🚌",cat:"nightlife",price:"$25",dur:"3h",wow:false}
  ],
  "Tokyo": [
    {name:"Tsukiji outer market sushi breakfast",emoji:"🐟",cat:"food",price:"Free",dur:"2h",wow:true},
    {name:"teamLab Planets digital art immersion",emoji:"🌊",cat:"unique",price:"$32",dur:"1.5h",wow:true},
    {name:"Yanaka old neighborhood slow walk",emoji:"🏮",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Robot Restaurant dinner show in Shinjuku",emoji:"🤖",cat:"unique",price:"$80",dur:"2h",wow:true},
    {name:"Mount Fuji day trip by bullet train",emoji:"🗻",cat:"nature",price:"$60",dur:"8h",wow:true}
  ],
  "Seoul": [
    {name:"Bukchon Hanok Village at dawn: empty streets",emoji:"🏯",cat:"culture",price:"Free",dur:"2h",wow:true},
    {name:"Gwangjang Market: bindaetteok & raw beef",emoji:"🥟",cat:"food",price:"$15",dur:"2h",wow:false},
    {name:"DMZ demilitarized zone guided tour",emoji:"🪖",cat:"culture",price:"$55",dur:"6h",wow:true},
    {name:"Korean jjimjilbang bathhouse experience",emoji:"♨️",cat:"wellness",price:"$12",dur:"Overnight",wow:false},
    {name:"K-pop dance class in Hongdae",emoji:"💃",cat:"culture",price:"$25",dur:"1.5h",wow:false}
  ],
  "Bangkok": [
    {name:"Long-tail boat through the Bangkok canals",emoji:"⛵",cat:"culture",price:"$20",dur:"2h",wow:true},
    {name:"Floating market at dawn: Damnoen Saduak",emoji:"🛶",cat:"culture",price:"$35",dur:"4h",wow:true},
    {name:"Thai cooking class with market visit",emoji:"👨‍🍳",cat:"food",price:"$45",dur:"4h",wow:false},
    {name:"Muay Thai fight night ringside seats",emoji:"🥊",cat:"culture",price:"$30",dur:"3h",wow:true},
    {name:"Wat Pho temple & the Reclining Buddha",emoji:"🛕",cat:"culture",price:"$5",dur:"1.5h",wow:false}
  ],
  "Medellin": [
    {name:"Comuna 13 graffiti tour & outdoor escalators",emoji:"🎨",cat:"culture",price:"$15",dur:"3h",wow:true},
    {name:"Metrocable up to the hillside barrios",emoji:"🚡",cat:"culture",price:"$1",dur:"1h",wow:false},
    {name:"Guatape rock day trip: 740 steps to the top",emoji:"🪨",cat:"adventure",price:"$45",dur:"6h",wow:true},
    {name:"El Poblado craft cocktail bar crawl",emoji:"🍸",cat:"nightlife",price:"$30",dur:"Evening",wow:false},
    {name:"Botero Plaza massive bronze sculptures",emoji:"🗿",cat:"culture",price:"Free",dur:"1h",wow:false}
  ],
  "Oaxaca": [
    {name:"Mezcal distillery tour in the valley",emoji:"🥃",cat:"food",price:"$25",dur:"4h",wow:true},
    {name:"Monte Alban Zapotec ruins at sunrise",emoji:"🏛️",cat:"culture",price:"$5",dur:"3h",wow:true},
    {name:"Mole negro cooking class with a local abuela",emoji:"👩‍🍳",cat:"food",price:"$60",dur:"4h",wow:true},
    {name:"Tlacolula Sunday indigenous market",emoji:"🛒",cat:"culture",price:"Free",dur:"3h",wow:false},
    {name:"Hierve el Agua petrified waterfall hike",emoji:"🌊",cat:"nature",price:"$5",dur:"3h",wow:true}
  ],
  "San Juan, PR": [
    {name:"Bioluminescent bay kayak tour at night",emoji:"✨",cat:"nature",price:"$65",dur:"2h",wow:true},
    {name:"El Morro fortress at sunset",emoji:"🏰",cat:"culture",price:"$10",dur:"2h",wow:false},
    {name:"Lechon pork feast at La Guardarraya",emoji:"🐖",cat:"food",price:"$20",dur:"2h",wow:true},
    {name:"El Yunque rainforest waterfall hike",emoji:"🌿",cat:"nature",price:"Free",dur:"4h",wow:false},
    {name:"La Placita de Santurce salsa dancing",emoji:"💃",cat:"nightlife",price:"Free",dur:"Evening",wow:false}
  ],
  "Marrakech": [
    {name:"Jemaa el-Fna at dusk: snake charmers & music",emoji:"🐍",cat:"culture",price:"Free",dur:"2h",wow:true},
    {name:"Traditional hammam & argan oil scrub",emoji:"🛁",cat:"wellness",price:"$30",dur:"2h",wow:true},
    {name:"Spice souk & leather tanneries in the medina",emoji:"🌿",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Atlas Mountains & Berber village day trip",emoji:"⛰️",cat:"adventure",price:"$60",dur:"8h",wow:true},
    {name:"Tagine & harira cooking class with a local",emoji:"🍲",cat:"food",price:"$55",dur:"3h",wow:false}
  ],
  "Cape Town": [
    {name:"Table Mountain cable car at sunrise",emoji:"🌄",cat:"nature",price:"$25",dur:"3h",wow:true},
    {name:"Shark cage diving off Gansbaai",emoji:"🦈",cat:"adventure",price:"$150",dur:"6h",wow:true},
    {name:"Boulders Beach: swim with African penguins",emoji:"🐧",cat:"nature",price:"$10",dur:"2h",wow:true},
    {name:"Cape Winelands wine tasting in Stellenbosch",emoji:"🍷",cat:"food",price:"$45",dur:"4h",wow:false},
    {name:"Bo-Kaap color walk & Cape Malay curry",emoji:"🏠",cat:"culture",price:"Free",dur:"2h",wow:false}
  ],
  "Bogota": [
    {name:"Gold Museum: world's largest pre-Columbian collection",emoji:"🥇",cat:"culture",price:"$3",dur:"2h",wow:true},
    {name:"Monserrate mountain gondola & city views",emoji:"🚡",cat:"nature",price:"$10",dur:"2h",wow:false},
    {name:"La Candelaria graffiti walking tour",emoji:"🎨",cat:"culture",price:"$15",dur:"2h",wow:false},
    {name:"Emerald trading district gem shopping",emoji:"💚",cat:"unique",price:"Free",dur:"1.5h",wow:false},
    {name:"Ciclovia Sunday bike ride: city closes streets",emoji:"🚲",cat:"adventure",price:"Free",dur:"3h",wow:true}
  ],
  "Nassau, Bahamas": [
    {name:"Swimming with pigs at Exuma day trip",emoji:"🐷",cat:"unique",price:"$180",dur:"6h",wow:true},
    {name:"Atlantis Aquaventure water park",emoji:"🌊",cat:"adventure",price:"$150",dur:"5h",wow:false},
    {name:"Snorkeling with sea turtles",emoji:"🐢",cat:"nature",price:"$45",dur:"3h",wow:true},
    {name:"Junkanoo Beach rum shack lunch",emoji:"🍹",cat:"food",price:"$20",dur:"2h",wow:false},
    {name:"Clifton Heritage kayak & cave tour",emoji:"🚣",cat:"adventure",price:"$55",dur:"3h",wow:false}
  ],
  "Punta Cana": [
    {name:"Hoyo Azul turquoise cenote swimming",emoji:"💎",cat:"nature",price:"$25",dur:"3h",wow:true},
    {name:"Saona Island catamaran day trip",emoji:"⛵",cat:"nature",price:"$75",dur:"8h",wow:true},
    {name:"Dune buggy through sugar cane fields",emoji:"🚗",cat:"adventure",price:"$65",dur:"3h",wow:false},
    {name:"Altos de Chavon artist village",emoji:"🏛️",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Scuba diving on the shipwreck reefs",emoji:"🤿",cat:"adventure",price:"$80",dur:"3h",wow:false}
  ],
  "Vancouver, BC": [
    {name:"Sea-to-Sky Gondola to alpine meadows",emoji:"🚡",cat:"nature",price:"$45",dur:"4h",wow:true},
    {name:"Grouse Mountain grizzly bears & zipline",emoji:"🐻",cat:"nature",price:"$60",dur:"4h",wow:true},
    {name:"Granville Island market artisan food stalls",emoji:"🧺",cat:"food",price:"$20",dur:"2h",wow:false},
    {name:"Stanley Park seawall sunrise bike ride",emoji:"🌲",cat:"nature",price:"$15",dur:"2h",wow:false},
    {name:"Capilano suspension bridge in the rainforest",emoji:"🌉",cat:"nature",price:"$45",dur:"2h",wow:false}
  ],
  "Portland, OR": [
    {name:"Powell's Books: world's largest used bookstore",emoji:"📚",cat:"culture",price:"Free",dur:"2h",wow:false},
    {name:"Mt Hood Timberline Lodge day hike",emoji:"🏔️",cat:"adventure",price:"Free",dur:"5h",wow:true},
    {name:"Craft distillery & brewery hop in the Pearl",emoji:"🍸",cat:"food",price:"$30",dur:"3h",wow:false},
    {name:"Multnomah Falls waterfall hike",emoji:"💧",cat:"nature",price:"Free",dur:"2h",wow:true},
    {name:"Japanese Garden in the West Hills",emoji:"🌸",cat:"culture",price:"$16",dur:"1.5h",wow:false}
  ],
  "San Diego, CA": [
    {name:"Sunset kayaking the La Jolla sea caves",emoji:"🚣",cat:"adventure",price:"$55",dur:"2h",wow:true},
    {name:"Snorkeling with leopard sharks at La Jolla Cove",emoji:"🦈",cat:"nature",price:"Free",dur:"2h",wow:true},
    {name:"Balboa Park: 17 museums in one park",emoji:"🏛️",cat:"culture",price:"$50",dur:"4h",wow:false},
    {name:"Fish tacos & craft IPA in Ocean Beach",emoji:"🌮",cat:"food",price:"$20",dur:"2h",wow:false},
    {name:"Sunset sailing on San Diego Bay",emoji:"⛵",cat:"nature",price:"$60",dur:"2h",wow:false}
  ],
  "Sedona, AZ": [
    {name:"Vortex energy sunrise hike at Bell Rock",emoji:"🌀",cat:"wellness",price:"Free",dur:"2h",wow:true},
    {name:"Hot air balloon over red rock canyons",emoji:"🎈",cat:"adventure",price:"$200",dur:"3h",wow:true},
    {name:"Stargazing Jeep tour into the dark sky reserve",emoji:"⭐",cat:"nature",price:"$75",dur:"3h",wow:true},
    {name:"Cathedral Rock sunset hike & swim",emoji:"🌅",cat:"nature",price:"Free",dur:"3h",wow:false},
    {name:"Tlaquepaque art village & gallery walk",emoji:"🎨",cat:"culture",price:"Free",dur:"2h",wow:false}
  ],
  "Honolulu, HI": [
    {name:"Sunrise hike up Diamond Head crater",emoji:"🌋",cat:"adventure",price:"$5",dur:"2h",wow:true},
    {name:"Snorkeling Hanauma Bay coral reef",emoji:"🐠",cat:"nature",price:"$25",dur:"3h",wow:true},
    {name:"North Shore shave ice & shrimp trucks",emoji:"🍧",cat:"food",price:"$15",dur:"2h",wow:false},
    {name:"Polynesian Cultural Center luau",emoji:"🌺",cat:"culture",price:"$60",dur:"4h",wow:false},
    {name:"Pearl Harbor memorial & USS Arizona",emoji:"⚓",cat:"culture",price:"Free",dur:"3h",wow:true}
  ],
  "Cabo San Lucas": [
    {name:"Snorkeling at Land's End with sea lions",emoji:"🦭",cat:"nature",price:"$35",dur:"2h",wow:true},
    {name:"Sport fishing: marlin & dorado",emoji:"🎣",cat:"adventure",price:"$150",dur:"6h",wow:true},
    {name:"ATV tour to the Pacific wild beaches",emoji:"🏍️",cat:"adventure",price:"$65",dur:"3h",wow:false},
    {name:"Sunset cruise to the Arch with open bar",emoji:"🌅",cat:"culture",price:"$55",dur:"2h",wow:false},
    {name:"Medano Beach morning swim & fish tacos",emoji:"🌊",cat:"food",price:"Free",dur:"2h",wow:false}
  ],
  "Puerto Vallarta": [
    {name:"Sierra Madre zip-line & Huichol village",emoji:"🌿",cat:"adventure",price:"$85",dur:"5h",wow:true},
    {name:"Whale watching: humpbacks (Dec-Mar)",emoji:"🐋",cat:"nature",price:"$65",dur:"3h",wow:true},
    {name:"Zona Romantica food & mezcal bar walk",emoji:"🥃",cat:"food",price:"$30",dur:"3h",wow:false},
    {name:"Yelapa waterfall hike by water taxi",emoji:"⛵",cat:"nature",price:"$25",dur:"4h",wow:true},
    {name:"Malecon sculpture walk at sunset",emoji:"🗿",cat:"culture",price:"Free",dur:"1h",wow:false}
  ],
};

const VIBE_EMOJI = {
  "Music & Food":"🎸","History":"🏰","Culture":"🏛️","Beach":"🏖️","City":"🌆",
  "Food":"🍽️","Nature":"🌿","Adventure":"🏔️","Romance":"💫","Cozy":"🕯️",
};

function getFlightTimes(flightH, days) {
  const deptH = 7, deptM = 15;
  const arrH = Math.floor(deptH + flightH), arrM = Math.round((deptH + flightH - Math.floor(deptH + flightH)) * 60);
  const retDeptH = days === 1 ? 20 : 17, retDeptM = 30;
  const retArrH = Math.floor(retDeptH + flightH), retArrM = Math.round((retDeptH + flightH - Math.floor(retDeptH + flightH)) * 60);
  const pad = n => String(n).padStart(2,"0");
  return {
    outDepart:`${pad(deptH)}:${pad(deptM)}`,
    outArrive:`${pad(arrH % 24)}:${pad(arrM)}`,
    retDepart:`${pad(retDeptH)}:${pad(retDeptM)}`,
    retArrive:`${pad(retArrH % 24)}:${pad(retArrM)}`,
    outDurMins: Math.round(flightH * 60),
    retDurMins: Math.round(flightH * 60) + 10,
  };
}

function generateTrips(region, airports, days, budget, moods, dateStr, party=1) {
  const AIRLINES = [["American","AA"],["Delta","DL"],["United","UA"],["JetBlue","B6"],["Southwest","WN"],["Alaska","AS"],["Spirit","NK"]];
  const tripCost = (t) => Math.round(t.price * (days === 1 ? 1 : days * 0.85) * party);
  let pool = ALL_TRIPS.filter(t => {
    const hubMatch = t.hubs.some(h => h === region);
    const budgetOk = tripCost(t) <= budget;
    const moodOk = moods.includes("all") || moods.some(m => t.moods.includes(m)) || (moods.includes("international") && !t.domestic);
    return hubMatch && budgetOk && moodOk;
  });

  // Fallback: relax hub filter if nothing found
  if (pool.length === 0) {
    pool = ALL_TRIPS.filter(t => {
      const budgetOk = tripCost(t) <= budget;
      const moodOk = moods.includes("all") || moods.some(m => t.moods.includes(m)) || (moods.includes("international") && !t.domestic);
      return budgetOk && moodOk;
    });
  }

  return pool.slice(0, 14).map((t, i) => {
    const totalPrice = tripCost(t);
    const outPrice = Math.round(totalPrice * 0.47);
    const retPrice = totalPrice - outPrice;
    const ft = getFlightTimes(t.flightH, days);
    const outAirline = AIRLINES[i % AIRLINES.length];
    const retAirline = AIRLINES[(i + 2) % AIRLINES.length];
    const fromAp = airports[i % airports.length];
    const toAp = airports[(i + 1) % airports.length] || airports[0];
    // True usable ground time:
    // - Subtract 1h from arrival (getting out of airport, into city)
    // - Subtract 2h (domestic) or 3h (international) airport arrival buffer before return flight
    const airportBuffer = t.domestic ? 1.5 : 2.5; // airport check-in buffer before return flight
    const cityTransitH = t.cityTransitH || (t.domestic ? 0.5 : 0.75); // airport-to-city transit each way
    const groundH = days === 1
      ? Math.max(3, 24 - t.flightH * 2 - airportBuffer - cityTransitH * 2)
      : (days - 1) * 22 + (24 - t.flightH * 2 - airportBuffer - cityTransitH * 2);
    const score = Math.min(99, Math.round(
      60
      + (budget - totalPrice) / budget * 25
      + groundH / 30 * 10
      + (t.domestic ? 0 : 5)
    ));
    return {
      id: i + 1,
      destination_city: t.city,
      destination_airport: t.ap,
      flag: t.flag,
      domestic: t.domestic,
      outbound: {
        from: fromAp, to: t.ap,
        airline: outAirline[0], flight_number: outAirline[1] + (1200 + i * 137),
        depart_time: ft.outDepart, arrive_time: ft.outArrive,
        duration_minutes: ft.outDurMins, estimated_price: outPrice,
      },
      return: {
        from: t.ap, to: toAp,
        airline: retAirline[0], flight_number: retAirline[1] + (2400 + i * 113),
        depart_time: ft.retDepart, arrive_time: ft.retArrive,
        duration_minutes: ft.retDurMins, estimated_price: retPrice,
      },
      total_price: totalPrice,
      total_price_pp: Math.round(totalPrice / party),
      party,
      hours_on_ground: Math.round(groundH * 10) / 10,
      destination_highlights: t.highlights,
      vibe: t.vibe,
      moods: t.moods,
      score,
      nights: days - 1,
      weather: getWeather(t.city, dateStr),
      hotel: t.hotel ? { budget: t.hotel[0] * (days-1), mid: t.hotel[1] * (days-1), luxury: t.hotel[2] * (days-1), perNight: t.hotel, nights: days-1 } : null,
    };
  });
}

function fmt12(t) {
  if (!t) return "?";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDur(m) { return `${Math.floor(m/60)}h ${m%60}m`; }

export default function App() {
  const [region, setRegion] = useState("");
  const [airports, setAirports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState(600);
  const [budgetMode, setBudgetMode] = useState("pp"); // "pp" = per person, "total" = total trip
  const [moods, setMoods] = useState(["all"]);
  const [party, setParty] = useState(1);
  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("best");
  const [expanded, setExpanded] = useState(null);
  const [expCat, setExpCat] = useState('all');
  const [trainTrips, setTrainTrips] = useState(null);
  const [showTrains, setShowTrains] = useState(false);

  const toggleAirport = c =>
    setAirports(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const pickRegion = r => { setRegion(r); setAirports(AIRPORTS[r] || []); };

  const search = () => {
    if (!region || airports.length === 0 || !startDate) {
      setError("Please select a region, airports, and travel date.");
      return;
    }
    setError("");
    setLoading(true);
    setTrips(null);
    setTrainTrips(null);
    setExpanded(null);
    // Convert budget to total trip cost for filtering
    const totalBudget = budgetMode === "pp" ? budget * party : budget;
    setTimeout(() => {
      const result = generateTrips(region, airports, days, totalBudget, moods, startDate, party);
      const trains = generateTrainTrips(region, days, totalBudget, moods);
      setTrips(result);
      setTrainTrips(trains);
      setShowTrains(trains.length > 0);
      setTab("best");
      setLoading(false);
    }, 600);
  };

  const sorted = () => {
    if (!trips) return [];
    const c = [...trips];
    if (tab === "best")  return c.sort((a,b) => b.score - a.score);
    if (tab === "cheap") return c.sort((a,b) => a.total_price - b.total_price);
    if (tab === "short") return c.sort((a,b) => (a.outbound.duration_minutes + a.return.duration_minutes) - (b.outbound.duration_minutes + b.return.duration_minutes));
    if (tab === "ground")return c.sort((a,b) => b.hours_on_ground - a.hours_on_ground);
    return c;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // ── Design tokens: editorial luxury ──
  const INK    = "#1a1a18";
  const CREAM  = "#f5f0e8";
  const FOREST = "#1a3a2a";
  const FLIGHT = "#2d5a3d";
  const SAGE   = "#4a7c5f";
  const WARM   = "#c8a96e";
  const MIST   = "#e8e2d8";
  const RULE   = "#d4cdc0";

  return (
    <div style={{ minHeight:"100vh", background:CREAM, color:INK, fontFamily:"'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity:0.5; cursor:pointer; }
        input[type=date]::-webkit-datetime-edit { color: ${INK}; }
        select option { background:${CREAM}; color:${INK}; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${RULE}; border-radius:4px; }
        .trip-card { transition: box-shadow 0.25s, transform 0.25s; }
        .trip-card:hover { box-shadow: 0 4px 32px rgba(26,58,42,0.10); }
        .mood-btn:hover { background: ${FOREST} !important; color: ${CREAM} !important; border-color: ${FOREST} !important; }
        .cta-btn { transition: background 0.2s, transform 0.1s; }
        .cta-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── Masthead rule ── */}
      <div style={{ borderBottom:`2px solid ${INK}`, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:1080, margin:"0 auto" }}>
        <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE }}>
          The Art of the Short Trip
        </div>
        <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#999" }}>
          Est. 2025
        </div>
      </div>

      <div style={{ position:"relative", maxWidth:880, margin:"0 auto", padding:"0 20px 60px" }}>

        {/* ── Hero Header ── */}
        <div style={{ textAlign:"center", padding:"52px 0 44px", borderBottom:`1px solid ${RULE}`, marginBottom:40 }}>
          <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:SAGE, marginBottom:12 }}>
            1–3 Days · Domestic & International
          </div>
          <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(52px,10vw,96px)", fontWeight:400, lineHeight:1, letterSpacing:"-0.02em", color:INK, margin:"0 0 12px" }}>
            Micro<span style={{ fontStyle:"italic", color:FOREST }}>Voyage</span>
          </div>
          <div style={{ width:48, height:2, background:FOREST, margin:"0 auto 18px" }} />
          <p style={{ fontFamily:"'Playfair Display', Georgia, serif", fontStyle:"italic", fontSize:"clamp(14px,2vw,18px)", color:"#666", margin:0, letterSpacing:"0.01em", maxWidth:500, marginLeft:"auto", marginRight:"auto", lineHeight:1.6 }}>
            Fly out at dawn. Explore the world. Be home before you know it.
          </p>
        </div>

        {/* ── Search Card ── */}
        <div style={{ background:"#fff", border:`1px solid ${RULE}`, borderTop:`3px solid ${FOREST}`, borderRadius:2, padding:"32px 28px", marginBottom:32, boxShadow:"0 2px 24px rgba(26,26,24,0.06)" }}>

          {/* Region */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Departing From</label>
            <select value={region} onChange={e => pickRegion(e.target.value)}
              style={{ width:"100%", background:CREAM, border:`1px solid ${RULE}`, borderRadius:2, color:INK, padding:"11px 13px", fontSize:14, outline:"none", fontFamily:"'DM Sans', sans-serif", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231a3a2a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 13px center" }}>
              <option value="">— Select your metro area —</option>
              {Object.keys(AIRPORTS).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Airports */}
          {region && (
            <div style={{ marginBottom:22 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>
                Airports <span style={{ color:"#999", textTransform:"none", letterSpacing:0, fontSize:11, fontWeight:400 }}>(mix outbound & return for open-jaw options)</span>
              </label>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {AIRPORTS[region].map(c => {
                  const on = airports.includes(c);
                  return <button key={c} onClick={() => toggleAirport(c)} className="mood-btn" style={{ padding:"6px 18px", borderRadius:2, border: on ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: on ? FOREST : "transparent", color: on ? CREAM : "#888", cursor:"pointer", fontSize:12, transition:"all 0.2s", letterSpacing:"0.05em" }}>{c}</button>;
                })}
              </div>
            </div>
          )}

          {/* Mood / Vibe filter */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>What Kind of Trip</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {MOOD_OPTIONS.map(m => {
                const on = moods.includes(m.key);
                return (
                  <button key={m.key} className="mood-btn" onClick={() => {
                    if (m.key === "all") {
                      setMoods(["all"]);
                    } else {
                      setMoods(prev => {
                        const without = prev.filter(x => x !== "all");
                        if (prev.includes(m.key)) {
                          const next = without.filter(x => x !== m.key);
                          return next.length === 0 ? ["all"] : next;
                        } else {
                          return [...without, m.key];
                        }
                      });
                    }
                  }} style={{ padding:"7px 15px", borderRadius:2, border: on ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: on ? FOREST : "transparent", color: on ? CREAM : "#888", cursor:"pointer", fontSize:12, transition:"all 0.2s", whiteSpace:"nowrap" }}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Party size */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Travelers{party > 1 ? ` · ${party} people` : ""}</label>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {[1,2,3,4,5].map(n => {
                const icons = ["🧳","👫","👨‍👩‍👧","👨‍👩‍👧‍👦","🎉"];
                const labels = ["Solo","2","3","4","5"];
                const on = party === n;
                return (
                  <button key={n} onClick={() => setParty(n)} className="mood-btn" style={{ flex:"1 1 0", padding:"10px 4px", borderRadius:2, border: on ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: on ? FOREST : "transparent", color: on ? CREAM : "#888", cursor:"pointer", transition:"all 0.2s", textAlign:"center" }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{icons[n-1]}</div>
                    <div style={{ fontSize:10, letterSpacing:"0.05em" }}>{labels[n-1]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip length */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Trip Length</label>
            <div style={{ display:"flex", gap:8 }}>
              {[1,2,3].map(d => {
                const on = days === d;
                return (
                  <button key={d} onClick={() => setDays(d)} className="mood-btn" style={{ flex:1, padding:"12px 6px", borderRadius:2, border: on ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: on ? FOREST : "transparent", color: on ? CREAM : "#888", cursor:"pointer", transition:"all 0.2s", textAlign:"center" }}>
                    <div style={{ fontWeight:500, fontSize:14 }}>{d} {d===1?"Day":"Days"}</div>
                    <div style={{ fontSize:10, color: on ? "rgba(245,240,232,0.65)" : "#aaa", marginTop:2, letterSpacing:"0.03em" }}>{d===1?"Same-day return":d===2?"1 night away":"2 nights away"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Budget */}
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:24 }}>
            <div style={{ flex:"1 1 160px", minWidth:0 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>
                {days===1 ? "Trip Date" : "Departure Date"}
              </label>
              <input type="date" value={startDate} min={minDate} onChange={e => setStartDate(e.target.value)}
                style={{ width:"100%", background:CREAM, border:`1px solid ${RULE}`, borderRadius:2, color:INK, padding:"11px 13px", fontSize:14, outline:"none" }} />
            </div>
            <div style={{ flex:"1 1 160px", minWidth:0 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>
                Flight Budget: <span style={{ color:INK, fontWeight:400 }}>${budget.toLocaleString()}</span>
                {party > 1 && budgetMode === "pp" && <span style={{ color:"#999", marginLeft:4, fontWeight:400 }}>(${(budget * party).toLocaleString()} total)</span>}
                {party > 1 && budgetMode === "total" && <span style={{ color:"#999", marginLeft:4, fontWeight:400 }}>(${Math.round(budget / party).toLocaleString()}/pp)</span>}
              </label>
              {party > 1 && (
                <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                  {[["pp","Per Person"],["total","Total Trip"]].map(([val,lbl]) => (
                    <button key={val} onClick={() => setBudgetMode(val)} className="mood-btn"
                      style={{ flex:1, padding:"5px 0", borderRadius:2, border: budgetMode===val ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: budgetMode===val ? FOREST : "transparent", color: budgetMode===val ? CREAM : "#888", cursor:"pointer", fontSize:10, transition:"all 0.2s" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ paddingTop:4 }}>
                <input type="range" min={200} max={3000} step={50} value={budget} onChange={e => setBudget(Number(e.target.value))}
                  style={{ width:"100%", accentColor:FOREST, cursor:"pointer" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#aaa", marginTop:3 }}>
                  <span>$200</span><span>$3,000</span>
                </div>
              </div>
            </div>
          </div>

          {error && <div style={{ color:"#c0392b", fontSize:13, marginBottom:12, fontStyle:"italic" }}>{error}</div>}

          <button onClick={search} disabled={loading} className="cta-btn"
            style={{ width:"100%", padding:"16px", background: loading ? MIST : FOREST, border:"none", borderRadius:2, color: loading ? "#aaa" : CREAM, fontSize:13, letterSpacing:"0.18em", textTransform:"uppercase", cursor: loading ? "not-allowed" : "pointer", fontWeight:500, transition:"all 0.3s" }}>
            {loading ? "Calculating your ground time…" : `Find My ${days===1?"Day Trip":days+"-Day Getaway"} →`}
          </button>
        </div>

        {/* ── Results ── */}
        {trips && trips.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:"#888", fontStyle:"italic", fontFamily:"'Playfair Display', serif" }}>
            No trips found within that budget. Try adjusting filters or increasing budget.
          </div>
        )}

        {trips && trips.length > 0 && (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
              <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:13, color:"#888", fontStyle:"italic" }}>
                {trips.length} trips found · {trips.filter(t=>!t.domestic).length} international
              </div>
            </div>

            {/* Sort tabs */}
            <div style={{ display:"flex", gap:0, borderBottom:`1px solid ${RULE}`, marginBottom:24 }}>
              {[["best","Best Match"],["cheap","Cheapest"],["short","Shortest Flight"],["ground","Most Time There"]].map(([k,l]) => (
                <button key={k} onClick={() => setTab(k)}
                  style={{ padding:"10px 16px", background:"transparent", border:"none", borderBottom: tab===k ? `2px solid ${FOREST}` : "2px solid transparent", color: tab===k ? FOREST : "#aaa", cursor:"pointer", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", fontWeight: tab===k ? 500 : 400, transition:"all 0.2s", marginBottom:-1 }}>
                  {l}
                </button>
              ))}
            </div>

            {sorted().map((trip, idx) => {
              const exp = expanded === trip.id;
              const gfOut = `https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.outbound.to}`;
              const gfRet = `https://www.google.com/travel/flights?q=flights+from+${trip.return.from}+to+${trip.return.to}`;
              const gfFull = `https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.destination_airport}`;
              const theme = getTheme(trip.destination_city);
              const groundH = Math.round(trip.hours_on_ground);
              const flightH = trip.outbound ? Math.round(trip.outbound.duration_minutes / 60 * 10) / 10 : 0;
              const patBg = patternSvg(theme.pattern, theme.c);

              return (
                <div key={trip.id} className="trip-card" style={{ background:"#fff", border:`1px solid ${RULE}`, borderLeft: idx===0 ? `4px solid ${FOREST}` : `1px solid ${RULE}`, marginBottom:16, overflow:"hidden" }}>

                  {/* Designed color hero */}
                  <div style={{ position:"relative", cursor:"pointer", height:180, overflow:"hidden",
                    background:`linear-gradient(135deg, ${theme.a} 0%, ${theme.b} 55%, ${theme.c} 100%)` }}
                    onClick={() => { setExpanded(exp ? null : trip.id); setExpCat('all'); }}>

                    {/* Geometric pattern overlay */}
                    <div style={{ position:"absolute", inset:0, backgroundImage:patBg, backgroundRepeat:"repeat" }} />

                    {/* Bottom fade so text stays readable */}
                    <div style={{ position:"absolute", inset:0, background:`linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)` }} />

                    {/* Top badges */}
                    <div style={{ position:"absolute", top:14, left:16, display:"flex", gap:6 }}>
                      {idx === 0 && <span style={{ fontSize:8, background:"rgba(255,255,255,0.2)", color:"#fff", padding:"3px 9px", letterSpacing:"0.14em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.4)", backdropFilter:"blur(6px)" }}>Best Match</span>}
                      <span style={{ fontSize:8, background:"rgba(0,0,0,0.35)", color:"rgba(255,255,255,0.85)", padding:"3px 9px", letterSpacing:"0.12em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.18)", backdropFilter:"blur(4px)" }}>{trip.vibe}</span>
                      {!trip.domestic && <span style={{ fontSize:8, background:"rgba(0,0,0,0.35)", color:"rgba(255,255,255,0.85)", padding:"3px 9px", letterSpacing:"0.12em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,0.18)", backdropFilter:"blur(4px)" }}>Intl ✈</span>}
                    </div>

                    {/* Top-right: weather */}
                    {trip.weather && (
                      <div style={{ position:"absolute", top:12, right:14, textAlign:"right" }}>
                        <span style={{ fontSize:20 }}>{trip.weather.e}</span>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", marginTop:1 }}>{trip.weather.hi}° / {trip.weather.lo}°</div>
                      </div>
                    )}

                    {/* Bottom: city name + ground time */}
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"14px 18px", display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:20 }}>{trip.flag}</span>
                          <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:26, fontWeight:400, color:"#fff", lineHeight:1 }}>{trip.destination_city}</span>
                        </div>
                        <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", letterSpacing:"0.1em" }}>
                          {trip.outbound.from} → {trip.destination_airport}
                          {trip.outbound.from !== trip.return.to && <span style={{ marginLeft:6, color:"rgba(255,255,255,0.4)" }}>open-jaw</span>}
                        </div>
                      </div>

                      {/* Ground time — the hero stat */}
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:52, fontWeight:400, lineHeight:1, color:"#fff" }}>{groundH}<span style={{ fontSize:20, color:"rgba(255,255,255,0.55)" }}>h</span></div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", letterSpacing:"0.15em", textTransform:"uppercase", marginTop:2 }}>on the ground</div>
                      </div>
                    </div>
                  </div>

                  {/* Summary strip below photo */}
                  <div style={{ padding:"10px 18px", background:"#fff", borderBottom: exp ? `1px solid ${RULE}` : "none", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}
                    onClick={() => { setExpanded(exp ? null : trip.id); setExpCat('all'); }}>

                    {/* Ground time math */}
                    <div style={{ fontSize:11, color:"#999", fontFamily:"'Playfair Display', serif", fontStyle:"italic" }}>
                      24h − {flightH * 2}h flying − {trip.domestic ? "1.5h" : "2.5h"} airports − transit = <span style={{ color:FOREST, fontWeight:600 }}>{groundH}h</span>
                    </div>

                    <div style={{ display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:17, color:FLIGHT, fontWeight:300 }}>${trip.total_price.toLocaleString()}</div>
                        {trip.party > 1 && <div style={{ fontSize:9, color:"#bbb" }}>${trip.total_price_pp.toLocaleString()}/pp</div>}
                        <div style={{ fontSize:8, color:"#ccc", letterSpacing:"0.08em", textTransform:"uppercase" }}>est. flights</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {exp && (
                    <div style={{ borderTop:`1px solid ${RULE}`, padding:"24px 24px" }}>

                      {/* Ground time breakdown — prominent */}
                      <div style={{ background:"#f0f7f3", border:`1px solid #c8e0d0`, borderLeft:`3px solid ${FOREST}`, borderRadius:2, padding:"14px 18px", marginBottom:20 }}>
                        <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:FOREST, fontWeight:500, marginBottom:10 }}>How We Calculate Your Ground Time</div>
                        <div style={{ display:"flex", gap:0, flexWrap:"wrap", alignItems:"center", fontSize:13 }}>
                          {[
                            { label:"Day starts", val:"24h", color:INK },
                            { label:"", val:"−", color:"#aaa" },
                            { label:"Flight × 2", val:`${flightH * 2}h`, color:"#888" },
                            { label:"", val:"−", color:"#aaa" },
                            { label:trip.domestic?"Airport buffer":"Intl airport buffer", val:trip.domestic?"1.5h":"2.5h", color:"#888" },
                            { label:"", val:"−", color:"#aaa" },
                            { label:"Transit to/from city", val:`${Math.round((trip.hours_on_ground - (24 - flightH*2 - (trip.domestic?1.5:2.5))) * 2) / 2 < 0 ? "incl." : Math.round(Math.abs(24 - flightH*2 - (trip.domestic?1.5:2.5) - trip.hours_on_ground)*2)/2+"h"}`, color:"#888" },
                            { label:"", val:"=", color:"#aaa" },
                            { label:"Your time", val:`${groundH}h`, color:FOREST },
                          ].map((item,i) => (
                            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 8px", borderRight: [1,3,5,7].includes(i) ? "none" : i < 8 ? `1px solid #c8e0d0` : "none" }}>
                              {item.label && <div style={{ fontSize:9, color:"#888", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:3, textAlign:"center" }}>{item.label}</div>}
                              <div style={{ fontSize: i===8 ? 22:16, fontFamily:"'Playfair Display', Georgia, serif", color:item.color, fontWeight: i===8 ? 600 : 400, lineHeight:1 }}>{item.val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop:10, fontSize:10, color:"#888", fontStyle:"italic" }}>
                          Based on a morning departure. Direct flights only — connections reduce ground time significantly.
                        </div>
                      </div>

                      {/* Flight details */}
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
                        {[{label:"Outbound",f:trip.outbound,url:gfOut},{label:"Return",f:trip.return,url:gfRet}].map(({label,f,url}) => (
                          <div key={label} style={{ flex:"1 1 200px", minWidth:0, background:CREAM, border:`1px solid ${RULE}`, padding:16 }}>
                            <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:SAGE, marginBottom:10, fontWeight:500 }}>✈ {label}</div>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                              <div><div style={{ fontSize:18, fontFamily:"'Playfair Display', serif" }}>{fmt12(f.depart_time)}</div><div style={{ fontSize:10, color:"#aaa", letterSpacing:"0.06em" }}>{f.from}</div></div>
                              <div style={{ textAlign:"center", color:"#ccc", fontSize:10 }}><div>{fmtDur(f.duration_minutes)}</div><div style={{ margin:"2px 0", letterSpacing:"0.2em" }}>——</div></div>
                              <div style={{ textAlign:"right" }}><div style={{ fontSize:18, fontFamily:"'Playfair Display', serif" }}>{fmt12(f.arrive_time)}</div><div style={{ fontSize:10, color:"#aaa", letterSpacing:"0.06em" }}>{f.to}</div></div>
                            </div>
                            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#aaa", marginBottom:10 }}>
                              <span style={{ fontStyle:"italic" }}>{f.airline} · typical schedule</span>
                              <span style={{ color:FLIGHT }}>~${f.estimated_price}</span>
                            </div>
                            <div style={{ fontSize:9, color:"#bbb", marginBottom:8, fontStyle:"italic" }}>
                              Times & prices are typical ranges — tap below for live fares
                            </div>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="cta-btn"
                              style={{ display:"block", textAlign:"center", padding:"8px", background:FOREST, color:CREAM, fontSize:10, textDecoration:"none", letterSpacing:"0.12em", textTransform:"uppercase" }}>
                              Search Google Flights →
                            </a>
                          </div>
                        ))}
                      </div>

                      {trip.weather && (
                        <div style={{ marginBottom:20 }}>
                          <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Weather This Month</div>
                          <div style={{ display:"flex", alignItems:"center", gap:16, background:CREAM, border:`1px solid ${RULE}`, padding:"14px 18px", flexWrap:"wrap" }}>
                            <div style={{ fontSize:36, lineHeight:1 }}>{trip.weather.e}</div>
                            <div>
                              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:INK, fontStyle:"italic" }}>{trip.weather.c}</div>
                              <div style={{ fontSize:12, color:"#888", marginTop:4 }}>
                                <span style={{ color:"#c0392b" }}>↑ {trip.weather.hi}°F</span>
                                <span style={{ margin:"0 10px", color:RULE }}>·</span>
                                <span style={{ color:"#2980b9" }}>↓ {trip.weather.lo}°F</span>
                              </div>
                            </div>
                            <div style={{ marginLeft:"auto" }}>
                              <a href={"https://www.google.com/search?q=" + encodeURIComponent(trip.destination_city + " weather " + new Date(startDate + "T12:00:00").toLocaleString("default",{month:"long"}))} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize:10, color:FOREST, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:`1px solid ${SAGE}`, paddingBottom:2 }}>
                                Live Forecast →
                              </a>
                            </div>
                          </div>
                        </div>
                      )}

                      {trip.hotel && (
                        <div style={{ marginBottom:20 }}>
                          {trip.nights > 0 ? (
                            <>
                              <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>
                                Where to Stay · {trip.nights} night{trip.nights > 1 ? "s" : ""}
                              </div>
                              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                                {[
                                  { label:"Budget", key:"budget", color:FLIGHT, desc:"Hostels, guesthouses" },
                                  { label:"Mid-range", key:"mid", color:FOREST, desc:"Boutique, 3–4★" },
                                  { label:"Luxury", key:"luxury", color:WARM, desc:"5★, design hotels" },
                                ].map(tier => (
                                  <div key={tier.key} style={{ flex:"1 1 100px", minWidth:0, background:CREAM, border:`1px solid ${RULE}`, padding:"12px 14px", textAlign:"center" }}>
                                    <div style={{ fontSize:9, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>{tier.label}</div>
                                    <div style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:tier.color }}>${(trip.hotel[tier.key] * trip.party).toLocaleString()}</div>
                                    <div style={{ fontSize:9, color:"#aaa", marginTop:3 }}>${trip.hotel.perNight[["budget","mid","luxury"].indexOf(tier.key)]}/night · {tier.desc}</div>
                                  </div>
                                ))}
                              </div>
                              <a href={"https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(trip.destination_city) + "&checkin=" + startDate + "&checkout=" + (() => { const d = new Date(startDate + "T12:00:00"); d.setDate(d.getDate() + trip.nights); return d.toISOString().split("T")[0]; })() + "&no_rooms=1&group_adults=" + trip.party}
                                target="_blank" rel="noopener noreferrer" className="cta-btn"
                                style={{ display:"block", textAlign:"center", padding:"8px", background:CREAM, border:`1px solid ${RULE}`, color:FOREST, fontSize:10, textDecoration:"none", letterSpacing:"0.12em", textTransform:"uppercase" }}>
                                Search Booking.com →
                              </a>
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>
                                Day-Use Hotels · Pool, Spa & Lounge Access
                              </div>
                              <div style={{ background:CREAM, border:`1px solid ${RULE}`, padding:"14px 18px", marginBottom:10 }}>
                                <div style={{ fontFamily:"'Playfair Display', serif", fontStyle:"italic", fontSize:14, color:INK, marginBottom:8, lineHeight:1.5 }}>
                                  No overnight stay needed. Book a luxury hotel by the day — use the pool, spa, or lounge between flights.
                                </div>
                                <div style={{ fontSize:11, color:"#888", marginBottom:12 }}>
                                  Typical day passes: <span style={{ color:FLIGHT }}>${trip.hotel.perNight[0]}–${trip.hotel.perNight[1]}</span> · Usually 9am–6pm access
                                </div>
                                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                                  {[
                                    { name:"DayUse.com", url:"https://www.dayuse.com/s#where=" + encodeURIComponent(trip.destination_city), desc:"Book by the hour" },
                                    { name:"HotelsByDay", url:"https://www.hotelsbyday.com/search?search_query=" + encodeURIComponent(trip.destination_city), desc:"Day rates" },
                                    { name:"ResortPass", url:"https://www.resortpass.com/search?q=" + encodeURIComponent(trip.destination_city), desc:"Pool & spa passes" },
                                  ].map(s => (
                                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="cta-btn"
                                      style={{ flex:"1 1 100px", padding:"8px 12px", background:CREAM, border:`1px solid ${RULE}`, color:FOREST, fontSize:10, textDecoration:"none", textAlign:"center" }}>
                                      <div style={{ fontWeight:500, marginBottom:2 }}>{s.name} →</div>
                                      <div style={{ fontSize:9, color:"#aaa" }}>{s.desc}</div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Experiences */}
                      {(() => {
                        const cityKey = Object.keys(EXPERIENCES).find(k => trip.destination_city.startsWith(k.split(",")[0]) || k === trip.destination_city.replace(", PR","").replace(", TN","").replace(", SC","").replace(", GA","").replace(", FL","").replace(", NC","").replace(", IL","").replace(", LA","").replace(", ME","").replace(", OR","").replace(", CA","").replace(", AZ","").replace(", HI","").replace(", BC","").replace(", ON","").replace(", QC",""));
                        const exps = EXPERIENCES[cityKey] || EXPERIENCES[trip.destination_city];
                        if (!exps) return null;
                        const cats = ["all","nature","food","culture","adventure","nightlife","wellness","unique"];
                        const catEmoji = {all:"All",nature:"Nature",food:"Food",culture:"Culture",adventure:"Adventure",nightlife:"Nightlife",wellness:"Wellness",unique:"Unique"};
                        const filtered = expCat === "all" ? exps : exps.filter(e => e.cat === expCat);
                        return (
                          <div style={{ marginBottom:20 }}>
                            <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:10, fontWeight:500 }}>
                              What to Do
                            </div>
                            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                              {cats.filter(c => c === "all" || exps.some(e => e.cat === c)).map(c => (
                                <button key={c} onClick={e => { e.stopPropagation(); setExpCat(c); }} className="mood-btn"
                                  style={{ padding:"4px 12px", border: expCat===c ? `1px solid ${FOREST}` : `1px solid ${RULE}`, background: expCat===c ? FOREST : "transparent", color: expCat===c ? CREAM : "#888", cursor:"pointer", fontSize:10, letterSpacing:"0.06em", transition:"all 0.2s" }}>
                                  {catEmoji[c]}
                                </button>
                              ))}
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                              {filtered.map((exp, ei) => (
                                <div key={ei} style={{ display:"flex", alignItems:"center", gap:12, background: exp.wow ? "#f0f7f3" : CREAM, border: exp.wow ? `1px solid #c8e0d0` : `1px solid ${RULE}`, padding:"10px 14px" }}>
                                  <div style={{ fontSize:22, flexShrink:0 }}>{exp.emoji}</div>
                                  <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:13, color:INK, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                                      {exp.name}
                                      {exp.wow && <span style={{ fontSize:8, padding:"1px 7px", background:FOREST, color:CREAM, letterSpacing:"0.1em", textTransform:"uppercase" }}>Editor's Pick</span>}
                                    </div>
                                    <div style={{ fontSize:11, color:"#888", marginTop:2 }}>
                                      <span style={{ color:FLIGHT }}>{exp.price}</span>
                                      <span style={{ margin:"0 6px", color:RULE }}>·</span>
                                      <span>{exp.dur}</span>
                                    </div>
                                  </div>
                                  <a href={"https://www.viator.com/searchResults/all?text=" + encodeURIComponent(exp.name + " " + trip.destination_city)}
                                    target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="cta-btn"
                                    style={{ flexShrink:0, padding:"5px 12px", background:CREAM, border:`1px solid ${RULE}`, color:FOREST, fontSize:9, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                                    Book →
                                  </a>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop:8, fontSize:10, color:"#aaa", fontStyle:"italic" }}>
                              Booking links open Viator — free cancellation on most experiences.
                            </div>
                          </div>
                        );
                      })()}

                      {/* Fare Alerts */}
                      <div style={{ marginBottom:20 }}>
                        <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Find Cheap Flights</div>
                        <div style={{ background:CREAM, border:`1px solid ${RULE}`, padding:"14px 18px" }}>
                          <div style={{ fontSize:12, color:"#888", marginBottom:12, fontStyle:"italic", lineHeight:1.6 }}>
                            Set price alerts for {trip.destination_city} — these services specialize in finding deals and error fares:
                          </div>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                            {[
                              { name:"Google Flights", url:`https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.destination_airport}&curr=USD&gl=us` },
                              { name:"Going.com", url:`https://going.com` },
                              { name:"Scott's Cheap", url:`https://scottscheapflights.com` },
                              { name:"Kayak Alerts", url:`https://www.kayak.com/flights/${trip.outbound.from}-${trip.destination_airport}` },
                              { name:"Hopper", url:`https://www.hopper.com` },
                            ].map(s => (
                              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="cta-btn"
                                style={{ padding:"6px 14px", border:`1px solid ${RULE}`, background:"#fff", color:FOREST, fontSize:10, textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                                {s.name} →
                              </a>
                            ))}
                          </div>
                          <div style={{ marginTop:10, fontSize:10, color:"#aaa", fontStyle:"italic" }}>
                            Going.com & Scott's Cheap Flights often surface error fares — sometimes 40–90% off.
                          </div>
                        </div>
                      </div>

                      <a href={gfFull} target="_blank" rel="noopener noreferrer" className="cta-btn"
                        style={{ display:"block", textAlign:"center", padding:"14px", background:FOREST, color:CREAM, fontSize:12, textDecoration:"none", letterSpacing:"0.16em", textTransform:"uppercase", fontWeight:500 }}>
                        Search Full Trip on Google Flights →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ── Train Trips Section ── */}
        {trainTrips && trainTrips.length > 0 && (
          <div style={{ marginTop:32 }}>
            <button onClick={() => setShowTrains(p => !p)}
              style={{ width:"100%", padding:"14px 20px", background:CREAM, border:`1px solid ${RULE}`, borderLeft:`3px solid #6b8e9f`, color:"#4a6b7a", cursor:"pointer", fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: showTrains ? 12 : 0, fontWeight:500 }}>
              <span>🚂  Also consider: {trainTrips.length} train trip{trainTrips.length > 1 ? "s" : ""} from your region</span>
              <span style={{ fontSize:11, transition:"transform 0.3s", transform: showTrains ? "rotate(180deg)" : "none" }}>↓</span>
            </button>

            {showTrains && trainTrips.map((trip, idx) => {
              const exp = expanded === trip.id;
              const amtrakUrl = `https://www.amtrak.com/buy/departure.html?fromStationName=${encodeURIComponent(trip.fromHub)}&toStationName=${encodeURIComponent(trip.destination_city)}&departDate=${startDate}&numberOfAdults=${party}`;
              return (
                <div key={trip.id} className="trip-card" style={{ background:"#fff", border:`1px solid ${RULE}`, borderLeft:"3px solid #6b8e9f", marginBottom:8, overflow:"hidden" }}>
                  <div style={{ padding:"18px 24px", cursor:"pointer", display:"flex", alignItems:"stretch", gap:20 }} onClick={() => setExpanded(exp ? null : trip.id)}>
                    <div style={{ flexShrink:0, textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minWidth:80, borderRight:`1px solid ${RULE}`, paddingRight:20 }}>
                      <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:42, fontWeight:400, lineHeight:1, color:"#4a6b7a" }}>{Math.round(trip.hours_on_ground)}</div>
                      <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b8e9f", marginTop:3 }}>hrs on ground</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
                        <span style={{ fontSize:18 }}>{trip.flag}</span>
                        <span style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:20, color:INK }}>{trip.destination_city}</span>
                        <span style={{ fontSize:9, padding:"2px 8px", border:"1px solid #b0c8d4", color:"#4a6b7a", letterSpacing:"0.1em", textTransform:"uppercase" }}>Train</span>
                        <span style={{ fontSize:9, padding:"2px 8px", border:`1px solid ${RULE}`, color:SAGE, letterSpacing:"0.1em", textTransform:"uppercase" }}>{trip.vibe}</span>
                      </div>
                      <div style={{ fontSize:11, color:"#888", fontStyle:"italic", fontFamily:"'Playfair Display', serif", marginBottom:4 }}>
                        {trip.fromHub} → {trip.destination_city} · {trip.one_way_hours}h each way · no airport security
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"space-between", flexShrink:0 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:20, color:"#4a6b7a", fontWeight:300 }}>${trip.total_price}</div>
                        <div style={{ fontSize:9, color:"#bbb", letterSpacing:"0.08em", textTransform:"uppercase" }}>r/t est.</div>
                      </div>
                      <div style={{ color:RULE, fontSize:13, transition:"transform 0.3s", transform: exp ? "rotate(180deg)" : "none" }}>↓</div>
                    </div>
                  </div>

                  {exp && (
                    <div style={{ borderTop:`1px solid ${RULE}`, padding:"20px 24px" }}>
                      <div style={{ background:"#f0f6f9", border:"1px solid #c0d8e4", borderLeft:"3px solid #6b8e9f", padding:"14px 18px", marginBottom:16 }}>
                        <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"#4a6b7a", marginBottom:10, fontWeight:500 }}>Journey Details</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                          <div><div style={{ fontFamily:"'Playfair Display', serif", fontSize:16 }}>{trip.fromHub}</div><div style={{ fontSize:10, color:"#888" }}>Your city</div></div>
                          <div style={{ textAlign:"center", color:"#aaa", fontSize:11 }}><div>{trip.one_way_hours}h</div><div style={{ margin:"3px 0", letterSpacing:"0.2em" }}>——🚂——</div></div>
                          <div style={{ textAlign:"right" }}><div style={{ fontFamily:"'Playfair Display', serif", fontSize:16 }}>{trip.destination_city}</div><div style={{ fontSize:10, color:"#888" }}>{trip.station_name}</div></div>
                        </div>
                        <div style={{ fontSize:11, color:"#888", fontStyle:"italic", marginBottom:12 }}>No airport security · Walk-on baggage · Scenic views · City-center arrival</div>
                        <a href={amtrakUrl} target="_blank" rel="noopener noreferrer" className="cta-btn"
                          style={{ display:"block", textAlign:"center", padding:"9px", background:"#4a6b7a", color:CREAM, fontSize:10, textDecoration:"none", letterSpacing:"0.12em", textTransform:"uppercase" }}>
                          Search on Amtrak.com →
                        </a>
                      </div>

                      {trip.nights > 0 && trip.hotel && (
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Where to Stay · {trip.nights} night{trip.nights > 1 ? "s" : ""}</div>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                            {[{label:"Budget",key:"budget",color:FLIGHT},{label:"Mid-range",key:"mid",color:FOREST},{label:"Luxury",key:"luxury",color:WARM}].map(tier => (
                              <div key={tier.key} style={{ flex:"1 1 90px", background:CREAM, border:`1px solid ${RULE}`, padding:"10px 12px", textAlign:"center" }}>
                                <div style={{ fontSize:9, color:"#aaa", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{tier.label}</div>
                                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:20, color:tier.color }}>${trip.hotel[tier.key].toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                          <a href={"https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(trip.destination_city) + "&checkin=" + startDate + "&checkout=" + (() => { const d = new Date(startDate + "T12:00:00"); d.setDate(d.getDate() + trip.nights); return d.toISOString().split("T")[0]; })()} target="_blank" rel="noopener noreferrer" className="cta-btn"
                            style={{ display:"block", textAlign:"center", padding:"8px", background:CREAM, border:`1px solid ${RULE}`, color:FOREST, fontSize:10, textDecoration:"none", letterSpacing:"0.12em", textTransform:"uppercase" }}>
                            Search Booking.com →
                          </a>
                        </div>
                      )}

                      <div>
                        <div style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:SAGE, marginBottom:8, fontWeight:500 }}>Highlights</div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {trip.destination_highlights.map((h,i) => (
                            <span key={i} style={{ padding:"4px 12px", border:`1px solid ${RULE}`, fontSize:12, color:"#888" }}>{h}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"#bbb", fontStyle:"italic", marginTop:10 }}>
                        Prices are round-trip estimates — verify on Amtrak.com · Acela available on select Northeast Corridor routes
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ── Footer masthead rule ── */}
      <div style={{ borderTop:`2px solid ${INK}`, padding:"16px 24px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:11, letterSpacing:"0.25em", textTransform:"uppercase", color:"#bbb" }}>
          MicroVoyage &nbsp;·&nbsp; <a href="mailto:dyle@micro.voyage" style={{ color:"#bbb", textDecoration:"none" }}>dyle@micro.voyage</a>
        </div>
      </div>
    </div>
  );
}
