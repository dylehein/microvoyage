import { useState } from "react";

const GOLD = "#c8a96e";
const GOLD_LIGHT = "rgba(200,169,110,0.15)";
const GOLD_BORDER = "rgba(200,169,110,0.4)";

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
  { city:"Nashville, TN",      ap:"BNA", domestic:true,  moods:["food","culture","city"],          hubs:["Washington DC","New York","Chicago","Atlanta","Philadelphia","Boston"],          price:260, flightH:1.5, vibe:"Music & Food",  flag:"🇺🇸", highlights:["Broadway honky-tonks","Hot chicken at Prince's","Ryman Auditorium"] , hotel:[89,159,320] },
  { city:"Charleston, SC",     ap:"CHS", domestic:true,  moods:["cozy","warm","culture","romance"], hubs:["Washington DC","New York","Boston","Philadelphia","Atlanta"],                    price:195, flightH:1.5, vibe:"History",       flag:"🇺🇸", highlights:["Rainbow Row","Magnolia Plantation","She-crab soup"] , hotel:[110,185,380] },
  { city:"Savannah, GA",       ap:"SAV", domestic:true,  moods:["cozy","romance","culture"],        hubs:["Washington DC","New York","Boston","Philadelphia","Atlanta"],                    price:175, flightH:1.5, vibe:"History",       flag:"🇺🇸", highlights:["Forsyth Park","River Street squares","Midnight in the Garden vibes"] , hotel:[95,165,310] },
  { city:"New Orleans, LA",    ap:"MSY", domestic:true,  moods:["food","culture","city","romance"], hubs:["Washington DC","New York","Chicago","Houston","Atlanta","Dallas"],               price:290, flightH:2.5, vibe:"Culture",       flag:"🇺🇸", highlights:["French Quarter","Café du Monde beignets","Jazz on Frenchmen St"] , hotel:[95,175,350] },
  { city:"Miami, FL",          ap:"MIA", domestic:true,  moods:["warm","city","romance","food"],    hubs:["Washington DC","New York","Boston","Chicago","Philadelphia","Atlanta"],          price:230, flightH:2.5, vibe:"Beach",         flag:"🇺🇸", highlights:["South Beach","Wynwood Walls","Little Havana"] , hotel:[130,220,480] },
  { city:"Key West, FL",       ap:"EYW", domestic:true,  moods:["warm","cozy","romance"],           hubs:["Washington DC","New York","Atlanta","Chicago"],                                  price:350, flightH:3.0, vibe:"Beach",         flag:"🇺🇸", highlights:["Duval Street","Sunset at Mallory Square","Snorkeling coral reefs"] , hotel:[180,290,520] },
  { city:"Asheville, NC",      ap:"AVL", domestic:true,  moods:["cozy","nature","food","romance"],  hubs:["Washington DC","New York","Atlanta","Philadelphia","Charlotte"],                 price:160, flightH:1.0, vibe:"Nature",        flag:"🇺🇸", highlights:["Blue Ridge Parkway","Biltmore Estate","Craft brewery scene"] , hotel:[95,160,300] },
  { city:"Chicago, IL",        ap:"ORD", domestic:true,  moods:["city","food","culture","adventure"],hubs:["Washington DC","New York","Boston","Miami","Atlanta","Philadelphia"],           price:255, flightH:2.0, vibe:"City",          flag:"🇺🇸", highlights:["Millennium Park","Deep dish at Lou Malnati's","Art Institute"] , hotel:[110,195,420] },
  { city:"Portland, ME",       ap:"PWM", domestic:true,  moods:["cozy","food","nature"],            hubs:["New York","Boston","Washington DC","Philadelphia"],                              price:145, flightH:1.0, vibe:"Food",          flag:"🇺🇸", highlights:["Lobster at Red's Eats","Old Port District","L.L.Bean flagship"] , hotel:[80,140,260] },
  { city:"Montreal, QC",       ap:"YUL", domestic:false, moods:["culture","food","cozy","romance"], hubs:["New York","Boston","Washington DC","Philadelphia","Chicago"],                    price:195, flightH:1.5, vibe:"Culture",       flag:"🇨🇦", highlights:["Old Montreal cobblestones","Poutine & bagels","Mont Royal Park"] , hotel:[90,155,300] },
  { city:"Quebec City, QC",    ap:"YQB", domestic:false, moods:["cozy","romance","culture","culture"],hubs:["New York","Boston","Washington DC"],                                           price:230, flightH:2.0, vibe:"History",       flag:"🇨🇦", highlights:["Château Frontenac","Old City walls","Poutine & maple everything"] , hotel:[100,170,320] },
  { city:"Toronto, ON",        ap:"YYZ", domestic:false, moods:["city","culture","food"],           hubs:["New York","Boston","Washington DC","Chicago","Philadelphia","Miami"],            price:210, flightH:1.5, vibe:"City",          flag:"🇨🇦", highlights:["Distillery District","CN Tower views","Diverse food scene"] , hotel:[110,185,380] },
  { city:"Reykjavik",          ap:"KEF", domestic:false, moods:["adventure","nature","romance"],    hubs:["New York","Boston","Washington DC","Chicago","Seattle"],                         price:650, flightH:6.0, vibe:"Adventure",     flag:"🇮🇸", highlights:["Northern Lights","Blue Lagoon geothermal spa","Golden Circle"] , hotel:[120,210,400] },
  { city:"London",             ap:"LHR", domestic:false, moods:["culture","city","food","cozy"],    hubs:["New York","Washington DC","Boston","Chicago","Miami","Atlanta","Los Angeles","San Francisco","Seattle","Dallas","Houston"],price:620, flightH:7.0, vibe:"Culture", flag:"🇬🇧", highlights:["Borough Market","Tate Modern","Covent Garden"] , hotel:[130,230,550] },
  { city:"Paris",              ap:"CDG", domestic:false, moods:["romance","culture","food","cozy"], hubs:["New York","Washington DC","Boston","Chicago","Miami","Los Angeles","Atlanta"],   price:680, flightH:7.5, vibe:"Romance",      flag:"🇫🇷", highlights:["Marais neighborhood","Musée d'Orsay","Wine & cheese picnic"] , hotel:[120,220,600] },
  { city:"Amsterdam",          ap:"AMS", domestic:false, moods:["culture","city","romance","food"], hubs:["New York","Washington DC","Boston","Chicago","Atlanta","Houston"],               price:640, flightH:7.5, vibe:"Culture",      flag:"🇳🇱", highlights:["Rijksmuseum","Canal boat ride","Vondelpark"] , hotel:[110,200,480] },
  { city:"Lisbon",             ap:"LIS", domestic:false, moods:["warm","romance","food","culture"], hubs:["New York","Washington DC","Boston","Miami","Chicago"],                           price:590, flightH:7.0, vibe:"Culture",      flag:"🇵🇹", highlights:["Alfama fado music","Pastéis de nata","Belém Tower"] , hotel:[90,160,360] },
  { city:"Barcelona",          ap:"BCN", domestic:false, moods:["warm","culture","food","romance"], hubs:["New York","Washington DC","Miami","Chicago","Los Angeles","Atlanta"],            price:670, flightH:8.5, vibe:"Culture",      flag:"🇪🇸", highlights:["Sagrada Família","La Boqueria market","Barceloneta beach"] , hotel:[100,185,420] },
  { city:"Rome",               ap:"FCO", domestic:false, moods:["culture","food","romance"],        hubs:["New York","Washington DC","Boston","Chicago","Miami","Los Angeles","Atlanta"],   price:710, flightH:9.0, vibe:"History",      flag:"🇮🇹", highlights:["Colosseum","Trastevere trattorias","Gelato at every corner"] , hotel:[100,190,440] },
  { city:"Dublin",             ap:"DUB", domestic:false, moods:["cozy","culture","food"],           hubs:["New York","Washington DC","Boston","Chicago","Philadelphia","Atlanta"],          price:520, flightH:6.5, vibe:"Cozy",         flag:"🇮🇪", highlights:["Temple Bar pubs","Guinness Storehouse","Howth coastal walk"] , hotel:[110,195,400] },
  { city:"Edinburgh",          ap:"EDI", domestic:false, moods:["cozy","culture","adventure"],      hubs:["New York","Washington DC","Boston","Chicago","Philadelphia"],                    price:580, flightH:7.5, vibe:"History",      flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", highlights:["Edinburgh Castle","Royal Mile whisky tasting","Arthur's Seat hike"] , hotel:[100,175,350] },
  { city:"Copenhagen",         ap:"CPH", domestic:false, moods:["cozy","food","culture"],           hubs:["New York","Washington DC","Chicago","Boston","Atlanta"],                         price:650, flightH:8.0, vibe:"Cozy",         flag:"🇩🇰", highlights:["Noma-style New Nordic cuisine","Tivoli Gardens","Nyhavn waterfront"] , hotel:[130,220,480] },
  { city:"Mexico City",        ap:"MEX", domestic:false, moods:["culture","food","city","warm"],    hubs:["Los Angeles","Houston","Dallas","Chicago","New York","Miami","Washington DC","Atlanta"],price:380, flightH:3.5, vibe:"Culture", flag:"🇲🇽", highlights:["Frida Kahlo Museum","Tacos al pastor","Teotihuacán pyramids"] , hotel:[55,110,280] },
  { city:"Cancún",             ap:"CUN", domestic:false, moods:["warm","adventure","romance"],      hubs:["New York","Chicago","Washington DC","Dallas","Houston","Atlanta","Philadelphia","Boston","Miami"],price:420, flightH:3.0, vibe:"Beach", flag:"🇲🇽", highlights:["Turquoise Caribbean waters","Cenote swimming","Tulum ruins"] , hotel:[80,160,380] },
  { city:"Havana",             ap:"HAV", domestic:false, moods:["culture","romance","warm","cozy"], hubs:["Miami","New York","Washington DC","Atlanta","Houston"],                          price:350, flightH:1.5, vibe:"Culture",      flag:"🇨🇺", highlights:["Classic car tours","Mojitos at La Bodeguita","Malecón sunset"] , hotel:[45,90,180] },
  { city:"San José, Costa Rica",ap:"SJO",domestic:false, moods:["adventure","nature","warm"],       hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta","Los Angeles"],   price:490, flightH:3.5, vibe:"Adventure",   flag:"🇨🇷", highlights:["Cloud forest canopy zip-lining","Arenal Volcano","Wildlife spotting"] , hotel:[60,120,250] },
  { city:"Cartagena",          ap:"CTG", domestic:false, moods:["warm","romance","culture","cozy"], hubs:["Miami","New York","Washington DC","Atlanta","Houston","Chicago"],                price:480, flightH:3.5, vibe:"Romance",      flag:"🇨🇴", highlights:["Walled city colonial architecture","Rosario Islands","Ceviche & arepas"] , hotel:[65,130,300] },
  { city:"Tokyo",              ap:"NRT", domestic:false, moods:["culture","food","city","adventure"],hubs:["Los Angeles","San Francisco","Seattle","New York","Chicago","Houston","Dallas"], price:1050,flightH:12.0,vibe:"City",         flag:"🇯🇵", highlights:["Tsukiji outer market sushi","Shibuya crossing","Yanaka old neighborhood"] , hotel:[80,160,420] },
  { city:"Seoul",              ap:"ICN", domestic:false, moods:["culture","food","city"],           hubs:["Los Angeles","San Francisco","Seattle","New York","Chicago"],                    price:950, flightH:12.0,vibe:"City",         flag:"🇰🇷", highlights:["Gwangjang Market street food","Bukchon Hanok Village","K-beauty shopping"] , hotel:[70,140,360] },
  { city:"Bangkok",            ap:"BKK", domestic:false, moods:["warm","food","culture","adventure"],hubs:["Los Angeles","San Francisco","Seattle","New York","Houston","Dallas"],          price:890, flightH:17.0,vibe:"Culture",     flag:"🇹🇭", highlights:["Floating markets","Wat Pho temple","Street pad thai"] , hotel:[35,80,220] },
  { city:"Medellín",           ap:"MDE", domestic:false, moods:["warm","culture","adventure","romance"],hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta"],             price:450, flightH:3.0, vibe:"City",         flag:"🇨🇴", highlights:["Flower Festival","Pablo Escobar tour","El Poblado cafés"] , hotel:[45,95,220] },
  { city:"Oaxaca",             ap:"OAX", domestic:false, moods:["culture","food","cozy","warm"],    hubs:["Los Angeles","Houston","Dallas","Chicago","New York","Miami"],                   price:410, flightH:4.0, vibe:"Culture",      flag:"🇲🇽", highlights:["Mezcal tasting","Zócalo colonial square","Mole negro"] , hotel:[50,100,220] },
  { city:"San Juan, PR",       ap:"SJU", domestic:true,  moods:["warm","romance","culture","food"], hubs:["New York","Washington DC","Boston","Philadelphia","Miami","Atlanta","Chicago"],  price:320, flightH:3.5, vibe:"Beach",        flag:"🇵🇷", highlights:["Old San Juan forts","Bioluminescent bay kayaking","Lechón at La Guardarraya"] , hotel:[110,190,400] },
  { city:"Marrakech",          ap:"RAK", domestic:false, moods:["culture","cozy","romance","adventure"],hubs:["New York","Washington DC","Miami","Boston","Chicago"],                       price:780, flightH:8.5, vibe:"Culture",      flag:"🇲🇦", highlights:["Jemaa el-Fna medina","Hammam spa","Spice souk"] , hotel:[60,130,350] },
  { city:"Cape Town",          ap:"CPT", domestic:false, moods:["adventure","nature","warm","romance"],hubs:["New York","Washington DC","Atlanta","Miami"],                                 price:1200,flightH:15.0,vibe:"Adventure",   flag:"🇿🇦", highlights:["Table Mountain cable car","Boulders Beach penguins","Cape Winelands"] , hotel:[75,150,380] },
  { city:"Bogotá",             ap:"BOG", domestic:false, moods:["culture","food","city","adventure"],hubs:["Miami","New York","Houston","Dallas","Washington DC","Atlanta"],                price:420, flightH:4.0, vibe:"City",         flag:"🇨🇴", highlights:["Gold Museum","Candelaria neighborhood","Emeralds & coffee shopping"] , hotel:[50,100,240] },
  { city:"Nassau, Bahamas",    ap:"NAS", domestic:false, moods:["warm","romance","adventure"],      hubs:["Miami","New York","Washington DC","Atlanta","Charlotte","Philadelphia"],         price:310, flightH:2.5, vibe:"Beach",        flag:"🇧🇸", highlights:["Crystal-clear swimming with pigs","Atlantis resort","Junkanoo Beach"] , hotel:[130,230,480] },
  { city:"Punta Cana",         ap:"PUJ", domestic:false, moods:["warm","romance","adventure"],      hubs:["New York","Washington DC","Miami","Boston","Philadelphia","Chicago","Atlanta"],  price:380, flightH:3.5, vibe:"Beach",        flag:"🇩🇴", highlights:["Bavaro Beach","Hoyo Azul cenote swimming","Local mamajuana rum"] , hotel:[90,180,400] },
  // West Coast focused
  { city:"Vancouver, BC",      ap:"YVR", domestic:false, moods:["nature","food","city","culture"],  hubs:["Seattle","Los Angeles","San Francisco","Portland"],                              price:220, flightH:1.0, vibe:"Nature",       flag:"🇨🇦", highlights:["Stanley Park seawall","Granville Island market","North Shore hiking"] , hotel:[110,190,400] },
  { city:"Portland, OR",       ap:"PDX", domestic:true,  moods:["food","cozy","nature","culture"],  hubs:["Seattle","San Francisco","Los Angeles","Las Vegas","Denver"],                   price:180, flightH:1.0, vibe:"Food",         flag:"🇺🇸", highlights:["Powell's Books","Voodoo Doughnut","Forest Park trails"] , hotel:[85,150,300] },
  { city:"San Diego, CA",      ap:"SAN", domestic:true,  moods:["warm","nature","food","adventure"],hubs:["San Francisco","Seattle","Portland","Denver","Las Vegas","Phoenix"],            price:160, flightH:1.0, vibe:"Beach",        flag:"🇺🇸", highlights:["Balboa Park","Fish tacos in Old Town","La Jolla sea caves"] , hotel:[110,185,380] },
  { city:"Sedona, AZ",         ap:"SEZ", domestic:true,  moods:["nature","adventure","cozy","romance"],hubs:["Los Angeles","Las Vegas","Denver","Dallas","Houston","Phoenix"],             price:200, flightH:1.5, vibe:"Adventure",    flag:"🇺🇸", highlights:["Red rock hiking","Vortex energy spots","Tlaquepaque art village"] , hotel:[130,210,420] },
  { city:"Honolulu, HI",       ap:"HNL", domestic:true,  moods:["warm","romance","nature","adventure"],hubs:["Los Angeles","San Francisco","Seattle","Portland","Las Vegas"],             price:480, flightH:5.5, vibe:"Beach",        flag:"🇺🇸", highlights:["Waimea Valley hike","Sunrise at Diamond Head","North Shore shave ice"] , hotel:[140,240,520] },
  { city:"Cabo San Lucas",     ap:"SJD", domestic:false, moods:["warm","romance","adventure","food"],hubs:["Los Angeles","San Francisco","Seattle","Dallas","Houston","Denver","Phoenix","Las Vegas"],price:350,flightH:2.5,vibe:"Beach",flag:"🇲🇽", highlights:["Arch of Cabo San Lucas","Sport fishing","Playa del Amor"] , hotel:[100,200,480] },
  { city:"Puerto Vallarta",    ap:"PVR", domestic:false, moods:["warm","romance","food","culture"],  hubs:["Los Angeles","San Francisco","Seattle","Dallas","Houston","Denver","Chicago"],  price:370, flightH:2.5, vibe:"Beach",        flag:"🇲🇽", highlights:["Malecón sculpture walk","Zona Romántica dining","Sierra Madre jungle tour"] , hotel:[80,160,380] },
];


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
  let pool = ALL_TRIPS.filter(t => {
    const hubMatch = t.hubs.some(h => h === region);
    const budgetOk = t.price * (days === 1 ? 1 : days * 0.85) <= budget;
    const moodOk = moods.includes("all") || moods.some(m => t.moods.includes(m)) || (moods.includes("international") && !t.domestic);
    return hubMatch && budgetOk && moodOk;
  });

  // Fallback: relax hub filter if nothing found
  if (pool.length === 0) {
    pool = ALL_TRIPS.filter(t => {
      const budgetOk = t.price * (days === 1 ? 1 : days * 0.85) <= budget;
      const moodOk = moods.includes("all") || moods.some(m => t.moods.includes(m)) || (moods.includes("international") && !t.domestic);
      return budgetOk && moodOk;
    });
  }

  return pool.slice(0, 14).map((t, i) => {
    const totalPrice = Math.round(t.price * (days === 1 ? 1 : days * 0.85) * party);
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
    const airportBuffer = t.domestic ? 2 : 3;
    const cityArrivalBuffer = 1;
    const groundH = days === 1
      ? Math.max(3, 24 - t.flightH * 2 - airportBuffer - cityArrivalBuffer)
      : (days - 1) * 22 + (24 - t.flightH * 2 - airportBuffer - cityArrivalBuffer);
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
  const [moods, setMoods] = useState(["all"]);
  const [party, setParty] = useState(1);
  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("best");
  const [expanded, setExpanded] = useState(null);
  const [expCat, setExpCat] = useState('all');

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
    setExpanded(null);
    setTimeout(() => {
      const result = generateTrips(region, airports, days, budget, moods, startDate, party);
      setTrips(result);
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

  const G = GOLD, GL = GOLD_LIGHT, GB = GOLD_BORDER;

  return (
    <div style={{ minHeight:"100vh", background:"#090b11", color:"#ddd8cc", fontFamily:"Georgia,serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(0.8) saturate(2) hue-rotate(5deg); cursor:pointer; }
        input[type=date]::-webkit-datetime-edit { color: #c8a96e; }
        select option { background:#111; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:4px; }
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 60% 35% at 10% 0%, rgba(200,169,110,0.06) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 90% 100%, rgba(80,120,220,0.04) 0%, transparent 55%)" }} />

      <div style={{ position:"relative", maxWidth:880, margin:"0 auto", padding:"28px 16px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:10, letterSpacing:"0.35em", textTransform:"uppercase", color:G, marginBottom:10 }}>
            1–3 Days · Domestic & International
          </div>
          <h1 style={{ fontSize:"clamp(28px,6vw,60px)", fontWeight:400, margin:"0 0 6px", letterSpacing:"-0.02em" }}>
            Micro<span style={{ color:G, fontStyle:"italic" }}>Voyage</span>
          </h1>
          <p style={{ color:"#555", fontStyle:"italic", fontSize:13, margin:0 }}>
            Fly out at dawn. Explore the world. Be home before you know it.
          </p>
        </div>

        {/* ── Search Card ── */}
        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"24px 20px", marginBottom:24 }}>

          {/* Region */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>Home Region</label>
            <select value={region} onChange={e => pickRegion(e.target.value)}
              style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, color:"#ddd8cc", padding:"11px 13px", fontSize:14, fontFamily:"Georgia,serif", outline:"none" }}>
              <option value="">— Select your metro area —</option>
              {Object.keys(AIRPORTS).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Airports */}
          {region && (
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>
                Airports <span style={{ color:"#444", textTransform:"none", letterSpacing:0, fontSize:11 }}>(mix outbound / return)</span>
              </label>
              <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                {AIRPORTS[region].map(c => {
                  const on = airports.includes(c);
                  return <button key={c} onClick={() => toggleAirport(c)} style={{ padding:"6px 16px", borderRadius:40, border: on ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.1)", background: on ? GL : "transparent", color: on ? G : "#666", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif", transition:"all 0.2s" }}>{c}</button>;
                })}
              </div>
            </div>
          )}

          {/* Mood / Vibe filter */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>I'm Looking For…</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {MOOD_OPTIONS.map(m => {
                const on = moods.includes(m.key);
                return (
                  <button key={m.key} onClick={() => {
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
                  }} style={{ padding:"7px 13px", borderRadius:40, border: on ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.1)", background: on ? GL : "transparent", color: on ? G : "#666", cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Party size */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>Party Size{party > 1 ? ` · ${party} travelers` : ""}</label>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {[1,2,3,4,5].map(n => {
                const icons = ["🧳","👫","👨‍👩‍👧","👨‍👩‍👧‍👦","🎉"];
                const labels = ["Solo","2 People","3 People","4 People","5 People"];
                const on = party === n;
                return (
                  <button key={n} onClick={() => setParty(n)} style={{ flex:"1 1 0", padding:"8px 4px", borderRadius:10, border: on ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.1)", background: on ? GL : "transparent", color: on ? G : "#555", cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.2s", textAlign:"center" }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{icons[n-1]}</div>
                    <div style={{ fontSize:10 }}>{labels[n-1]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip length */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>Trip Length</label>
            <div style={{ display:"flex", gap:8 }}>
              {[1,2,3].map(d => {
                const on = days === d;
                return (
                  <button key={d} onClick={() => setDays(d)} style={{ flex:1, padding:"10px 6px", borderRadius:10, border: on ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.1)", background: on ? GL : "transparent", color: on ? G : "#666", cursor:"pointer", fontSize:13, fontFamily:"Georgia,serif", transition:"all 0.2s", textAlign:"center" }}>
                    <div style={{ fontWeight: on ? 700 : 400 }}>{d} {d===1?"Day":"Days"}</div>
                    <div style={{ fontSize:10, color: on ? G : "#444", marginTop:2 }}>{d===1?"Same-day return":d===2?"1 night away":"2 nights away"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Budget */}
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:20 }}>
            <div style={{ flex:"1 1 160px", minWidth:0 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>
                {days===1 ? "Trip Date" : "Departure Date"}
              </label>
              <input type="date" value={startDate} min={minDate} onChange={e => setStartDate(e.target.value)}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, color:"#c8a96e", padding:"11px 13px", fontSize:14, fontFamily:"Georgia,serif", outline:"none", accentColor:G, colorScheme:"dark" }} />
            </div>
            <div style={{ flex:"1 1 160px", minWidth:0 }}>
              <label style={{ display:"block", fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:G, marginBottom:8 }}>
                Budget: <span style={{ color:"#ddd8cc" }}>${budget.toLocaleString()}</span>
              </label>
              <div style={{ paddingTop:8 }}>
                <input type="range" min={200} max={3000} step={50} value={budget} onChange={e => setBudget(Number(e.target.value))}
                  style={{ width:"100%", accentColor:G, cursor:"pointer" }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#333", marginTop:3 }}>
                  <span>$200</span><span>$3,000</span>
                </div>
              </div>
            </div>
          </div>

          {error && <div style={{ color:"#ff7070", fontSize:13, marginBottom:12, fontStyle:"italic" }}>{error}</div>}

          <button onClick={search} disabled={loading}
            style={{ width:"100%", padding:"14px", background: loading ? "rgba(200,169,110,0.25)" : `linear-gradient(135deg,#c8a96e,#e8c97e)`, border:"none", borderRadius:10, color: loading ? "#888" : "#090b11", fontSize:14, fontFamily:"Georgia,serif", letterSpacing:"0.14em", textTransform:"uppercase", cursor: loading ? "not-allowed" : "pointer", fontWeight:700, transition:"all 0.3s" }}>
            {loading ? "✈ Searching the globe…" : `Find My ${days===1?"Day Trip":days+"-Day Getaway"}`}
          </button>
        </div>

        {/* ── Results ── */}
        {trips && trips.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:"#555", fontStyle:"italic" }}>
            No trips found. Try a higher budget, different mood, or more airports.
          </div>
        )}

        {trips && trips.length > 0 && (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
              <div style={{ fontSize:12, color:"#555", fontStyle:"italic" }}>
                {trips.length} trips found · {trips.filter(t=>!t.domestic).length} international
              </div>
            </div>

            {/* Sort tabs */}
            <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.02)", padding:4, borderRadius:12, border:"1px solid rgba(255,255,255,0.05)", marginBottom:16 }}>
              {[["best","⭐ Best"],["cheap","💰 Cheapest"],["short","⚡ Shortest"],["ground","🗺 Ground Time"]].map(([k,l]) => (
                <button key={k} onClick={() => setTab(k)}
                  style={{ flex:1, padding:"9px 4px", background: tab===k ? GL : "transparent", border: tab===k ? `1px solid ${GB}` : "1px solid transparent", borderRadius:8, color: tab===k ? G : "#555", cursor:"pointer", fontSize:12, fontFamily:"Georgia,serif", transition:"all 0.2s" }}>
                  {l}
                </button>
              ))}
            </div>

            {sorted().map((trip, idx) => {
              const exp = expanded === trip.id;
              const gfOut = `https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.outbound.to}`;
              const gfRet = `https://www.google.com/travel/flights?q=flights+from+${trip.return.from}+to+${trip.return.to}`;
              const gfFull = `https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.destination_airport}`;

              return (
                <div key={trip.id} style={{ background:"rgba(255,255,255,0.025)", border: exp ? `1px solid ${GB}` : "1px solid rgba(255,255,255,0.06)", borderRadius:13, overflow:"hidden", marginBottom:10, transition:"border 0.3s" }}>

                  {/* Summary row */}
                  <div style={{ padding:"15px 17px", cursor:"pointer", display:"flex", alignItems:"center", gap:11 }} onClick={() => { setExpanded(exp ? null : trip.id); setExpCat('all'); }}>

                    <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                      background: idx===0 ? `linear-gradient(135deg,#c8a96e,#e8c97e)` : "rgba(255,255,255,0.04)",
                      color: idx===0 ? "#090b11" : "#444" }}>{idx+1}</div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:3 }}>
                        <span style={{ fontSize:15 }}>{trip.flag}</span>
                        <span style={{ fontSize:16, fontWeight:400 }}>{trip.destination_city}</span>
                        <span style={{ fontSize:11, color:"#555" }}>{trip.destination_airport}</span>
                        <span style={{ fontSize:9, padding:"2px 7px", borderRadius:20, background:GL, color:G, border:`1px solid ${GB}`, letterSpacing:"0.08em", textTransform:"uppercase" }}>{trip.vibe}</span>
                        {!trip.domestic && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:20, background:"rgba(100,180,255,0.08)", color:"#7ab8f5", border:"1px solid rgba(100,180,255,0.2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Intl</span>}
                        {trip.nights > 0 && <span style={{ fontSize:9, padding:"2px 7px", borderRadius:20, background:"rgba(160,120,255,0.08)", color:"#b89cf5", border:"1px solid rgba(160,120,255,0.2)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{trip.nights}N</span>}
                        {trip.weather && <span style={{ fontSize:12 }} title={trip.weather.c}>{trip.weather.e} {trip.weather.hi}°F</span>}
                      </div>
                      <div style={{ fontSize:11, color:"#444", fontStyle:"italic" }}>
                        {trip.outbound.from}→{trip.destination_airport} · return {trip.return.from}→{trip.return.to}
                        {trip.outbound.from !== trip.return.to && <span style={{ color:G, marginLeft:5 }}>✦</span>}
                      </div>
                    </div>

                    <div style={{ display:"flex", gap:12, alignItems:"center", flexShrink:0 }}>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:17, color:"#7fc47f" }}>${trip.total_price.toLocaleString()}{trip.party > 1 && <span style={{ fontSize:10, color:"#555", marginLeft:4 }}>(${trip.total_price_pp.toLocaleString()}/pp)</span>}</div>
                        <div style={{ fontSize:8, color:"#444", textTransform:"uppercase", letterSpacing:"0.1em" }}>r/t est.</div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:13, color:"#8ab4f8" }}>{Math.round(trip.hours_on_ground)}h</div>
                        <div style={{ fontSize:8, color:"#444", textTransform:"uppercase", letterSpacing:"0.1em" }}>usable</div>
                      </div>
                      <div style={{ color:"#333", fontSize:13, transition:"transform 0.3s", transform: exp ? "rotate(180deg)" : "none" }}>↓</div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {exp && (
                    <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"15px 17px" }}>
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:13 }}>
                        {[{label:"🛫 Outbound",f:trip.outbound,url:gfOut},{label:"🛬 Return",f:trip.return,url:gfRet}].map(({label,f,url}) => (
                          <div key={label} style={{ flex:"1 1 190px", minWidth:0, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:12 }}>
                            <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:G, marginBottom:8 }}>{label}</div>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                              <div><div style={{ fontSize:16 }}>{fmt12(f.depart_time)}</div><div style={{ fontSize:10, color:"#555" }}>{f.from}</div></div>
                              <div style={{ textAlign:"center", color:"#333", fontSize:10 }}><div>{fmtDur(f.duration_minutes)}</div><div style={{ margin:"2px 0" }}>──✈──</div></div>
                              <div style={{ textAlign:"right" }}><div style={{ fontSize:16 }}>{fmt12(f.arrive_time)}</div><div style={{ fontSize:10, color:"#555" }}>{f.to}</div></div>
                            </div>
                            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#555", marginBottom:8 }}>
                              <span>{f.airline} {f.flight_number}</span>
                              <span style={{ color:"#7fc47f" }}>${f.estimated_price}</span>
                            </div>
                            <a href={url} target="_blank" rel="noopener noreferrer"
                              style={{ display:"block", textAlign:"center", padding:"6px", borderRadius:6, background:GL, border:`1px solid ${GB}`, color:G, fontSize:10, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                              Search Google Flights ↗
                            </a>
                          </div>
                        ))}
                      </div>

                      {trip.weather && (
                        <div style={{ marginBottom:12 }}>
                          <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:7 }}>Weather This Month</div>
                          <div style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 16px", flexWrap:"wrap" }}>
                            <div style={{ fontSize:32, lineHeight:1 }}>{trip.weather.e}</div>
                            <div>
                              <div style={{ fontSize:16, fontWeight:400, color:"#ddd8cc" }}>{trip.weather.c}</div>
                              <div style={{ fontSize:12, color:"#666", marginTop:3 }}>
                                <span style={{ color:"#e87c5a" }}>↑ {trip.weather.hi}°F</span>
                                <span style={{ margin:"0 8px", color:"#333" }}>·</span>
                                <span style={{ color:"#8ab4f8" }}>↓ {trip.weather.lo}°F</span>
                              </div>
                            </div>
                            <div style={{ marginLeft:"auto" }}>
                              <a href={"https://www.google.com/search?q=" + encodeURIComponent(trip.destination_city + " weather " + new Date(startDate + "T12:00:00").toLocaleString("default",{month:"long"}))} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize:10, color:G, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase", borderBottom:"1px solid rgba(200,169,110,0.3)", paddingBottom:1 }}>
                                Live Forecast ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      {trip.hotel && (
                        <div style={{ marginBottom:12 }}>
                          {trip.nights > 0 ? (
                            <>
                              <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:7 }}>
                                Hotel Estimates · {trip.nights} night{trip.nights > 1 ? "s" : ""}
                              </div>
                              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                                {[
                                  { label:"Budget", key:"budget", color:"#7fc47f", icon:"🏨", desc:"Hostels, guesthouses" },
                                  { label:"Mid-range", key:"mid", color:G, icon:"🏩", desc:"Boutique, 3–4★" },
                                  { label:"Luxury", key:"luxury", color:"#b89cf5", icon:"🏰", desc:"5★, design hotels" },
                                ].map(tier => (
                                  <div key={tier.key} style={{ flex:"1 1 100px", minWidth:0, background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
                                    <div style={{ fontSize:16, marginBottom:4 }}>{tier.icon}</div>
                                    <div style={{ fontSize:9, color:"#555", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{tier.label}</div>
                                    <div style={{ fontSize:18, color:tier.color, fontWeight:400 }}>${(trip.hotel[tier.key] * trip.party).toLocaleString()}</div>
                                    <div style={{ fontSize:9, color:"#444", marginTop:2 }}>${trip.hotel.perNight[["budget","mid","luxury"].indexOf(tier.key)]}/night/room{trip.party > 1 ? ` · $${(trip.hotel[tier.key] * trip.party).toLocaleString()} total` : ""}</div>
                                    <div style={{ fontSize:9, color:"#444", marginTop:1, fontStyle:"italic" }}>{tier.desc}</div>
                                  </div>
                                ))}
                              </div>
                              <a href={"https://www.hotels.com/search.do?q-destination=" + encodeURIComponent(trip.destination_city) + "&q-check-in=" + startDate + "&q-check-out=" + (() => { const d = new Date(startDate + "T12:00:00"); d.setDate(d.getDate() + trip.nights); return d.toISOString().split("T")[0]; })() + "&q-rooms=1&q-room-0-adults=1"}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display:"block", textAlign:"center", padding:"7px", borderRadius:7, background:"rgba(127,196,127,0.08)", border:"1px solid rgba(127,196,127,0.2)", color:"#7fc47f", fontSize:10, textDecoration:"none", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                                Search Hotels.com ↗
                              </a>
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:7 }}>
                                Day-Use Hotels · Pool, Spa & Lounge Access
                              </div>
                              <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                                <div style={{ fontSize:13, color:"#ddd8cc", marginBottom:6, lineHeight:1.5 }}>
                                  🛁 No overnight stay needed — book a luxury hotel by the day. Use the pool, spa, gym, or lounge between flights.
                                </div>
                                <div style={{ fontSize:11, color:"#666", marginBottom:10, fontStyle:"italic" }}>
                                  Typical day passes: <span style={{ color:"#7fc47f" }}>${trip.hotel.perNight[0]}–${trip.hotel.perNight[1]}</span> · Usually 9am–6pm access
                                </div>
                                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                                  {[
                                    { name:"DayUse.com", icon:"🌞", color:"#f5c842", url:"https://www.dayuse.com/s#where=" + encodeURIComponent(trip.destination_city), desc:"Book by the hour or half-day" },
                                    { name:"HotelsByDay", icon:"⏰", color:"#8ab4f8", url:"https://www.hotelsbyday.com/search?search_query=" + encodeURIComponent(trip.destination_city), desc:"Day rates at top hotels" },
                                    { name:"ResortPass", icon:"🏊", color:"#7fc47f", url:"https://www.resortpass.com/search?q=" + encodeURIComponent(trip.destination_city), desc:"Pool & spa day passes" },
                                  ].map(s => (
                                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                                      style={{ flex:"1 1 120px", minWidth:0, display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 8px", borderRadius:9, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:s.color, fontSize:11, textDecoration:"none", textAlign:"center", transition:"all 0.2s" }}>
                                      <span style={{ fontSize:18 }}>{s.icon}</span>
                                      <span style={{ fontWeight:600 }}>{s.name} ↗</span>
                                      <span style={{ fontSize:9, color:"#555", fontStyle:"italic" }}>{s.desc}</span>
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
                        const catEmoji = {all:"✨",nature:"🌿",food:"🍽️",culture:"🏛️",adventure:"🏔️",nightlife:"🌃",wellness:"🧘",unique:"🎭"};
                        const filtered = expCat === "all" ? exps : exps.filter(e => e.cat === expCat);
                        return (
                          <div style={{ marginBottom:14 }}>
                            <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:8 }}>
                              Experiences & Things to Do
                            </div>
                            {/* Category filter */}
                            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                              {cats.filter(c => c === "all" || exps.some(e => e.cat === c)).map(c => (
                                <button key={c} onClick={e => { e.stopPropagation(); setExpCat(c); }}
                                  style={{ padding:"4px 10px", borderRadius:20, border: expCat===c ? `1px solid ${G}` : "1px solid rgba(255,255,255,0.08)", background: expCat===c ? GL : "transparent", color: expCat===c ? G : "#555", cursor:"pointer", fontSize:11, fontFamily:"Georgia,serif", transition:"all 0.2s" }}>
                                  {catEmoji[c]} {c.charAt(0).toUpperCase()+c.slice(1)}
                                </button>
                              ))}
                            </div>
                            {/* Experience cards */}
                            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                              {filtered.map((exp, ei) => (
                                <div key={ei} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.025)", border: exp.wow ? `1px solid rgba(200,169,110,0.25)` : "1px solid rgba(255,255,255,0.05)", borderRadius:9, padding:"9px 12px" }}>
                                  <div style={{ fontSize:20, flexShrink:0 }}>{exp.emoji}</div>
                                  <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontSize:13, color:"#ddd8cc", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                                      {exp.name}
                                      {exp.wow && <span style={{ fontSize:9, padding:"1px 6px", borderRadius:10, background:GL, color:G, border:`1px solid ${GB}`, letterSpacing:"0.08em", flexShrink:0 }}>★ WOW</span>}
                                    </div>
                                    <div style={{ fontSize:11, color:"#555", marginTop:2 }}>
                                      <span style={{ color:"#7fc47f" }}>{exp.price}</span>
                                      <span style={{ margin:"0 6px", color:"#333" }}>·</span>
                                      <span>{exp.dur}</span>
                                    </div>
                                  </div>
                                  <a href={"https://www.viator.com/searchResults/all?text=" + encodeURIComponent(exp.name + " " + trip.destination_city)}
                                    target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                    style={{ flexShrink:0, padding:"5px 10px", borderRadius:6, background:GL, border:`1px solid ${GB}`, color:G, fontSize:10, textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                                    Book ↗
                                  </a>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop:7, fontSize:10, color:"#333", fontStyle:"italic" }}>
                              Book links open Viator — they offer free cancellation on most experiences.
                            </div>
                          </div>
                        );
                      })()}

                      {/* Fare Alerts */}
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:7 }}>🔔 Set a Fare Alert</div>
                        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:"10px 12px" }}>
                          <div style={{ fontSize:11, color:"#666", marginBottom:9, fontStyle:"italic", lineHeight:1.5 }}>
                            Get notified of price drops, error fares & flash sales for {trip.destination_city}:
                          </div>
                          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                            {[
                              { name:"Google Flights", icon:"✈️", color:"#8ab4f8", url:`https://www.google.com/travel/flights?q=flights+from+${trip.outbound.from}+to+${trip.destination_airport}&curr=USD&gl=us` },
                              { name:"Going.com", icon:"⚡", color:G, url:`https://going.com` },
                              { name:"Scott's Cheap", icon:"🎯", color:"#f5a623", url:`https://scottscheapflights.com` },
                              { name:"Kayak Alerts", icon:"🔔", color:"#ff7070", url:`https://www.kayak.com/flights/${trip.outbound.from}-${trip.destination_airport}` },
                              { name:"Hopper", icon:"🐰", color:"#b89cf5", url:`https://www.hopper.com` },
                            ].map(s => (
                              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                                style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 11px", borderRadius:8, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", color:s.color, fontSize:11, textDecoration:"none", transition:"all 0.2s" }}>
                                <span>{s.icon}</span><span>{s.name}</span>
                              </a>
                            ))}
                          </div>
                          <div style={{ marginTop:8, fontSize:10, color:"#333", fontStyle:"italic" }}>
                            💡 Going.com & Scott's Cheap Flights specialize in error fares — often 40–90% off normal prices.
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"#444", marginBottom:7 }}>Things to do</div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {trip.destination_highlights.map((h,i) => (
                            <span key={i} style={{ padding:"4px 11px", borderRadius:20, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", fontSize:12, color:"#bbb" }}>{h}</span>
                          ))}
                        </div>
                      </div>

                      <a href={gfFull} target="_blank" rel="noopener noreferrer"
                        style={{ display:"block", textAlign:"center", padding:"11px", borderRadius:9, background:`linear-gradient(135deg,${GL},rgba(200,169,110,0.07))`, border:`1px solid ${GB}`, color:G, fontSize:11, textDecoration:"none", letterSpacing:"0.13em", textTransform:"uppercase", fontWeight:600 }}>
                        🔍 Search Full Trip on Google Flights ↗
                      </a>
                      <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", fontSize:10, color:"#555", fontStyle:"italic", lineHeight:1.7 }}>
                        ⏱ Usable time = land + 1h to city · return: {trip.domestic ? "2h" : "3h"} early to airport · Prices are estimates — verify on Google Flights.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
