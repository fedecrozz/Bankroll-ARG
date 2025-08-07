// Definiciones de los 28 casilleros del tablero con temática argentina actual
export const boardSpaces = [
  // Casilla de inicio
  {
    id: 0,
    name: "LARGADA",
    type: "START",
    description: "Cobra $200.000 cada vez que pases",
    color: "#00FF00"
  },

  // Costa Atlántica (Color Arena - #FFE4C4)
  {
    id: 1,
    name: "Mar del Plata",
    type: "PROPERTY",
    price: 60000,
    rent: [2000, 10000, 30000, 90000, 160000, 250000],
    group: "costa",
    color: "#FFE4C4",
    description: "La perla del Atlántico"
  },
  {
    id: 2,
    name: "Villa Gesell",
    type: "PROPERTY",
    price: 80000,
    rent: [4000, 20000, 60000, 180000, 320000, 450000],
    group: "costa",
    color: "#FFE4C4",
    description: "Playas y médanos"
  },
  {
    id: 3,
    name: "San Bernardo",
    type: "PROPERTY",
    price: 100000,
    rent: [6000, 30000, 90000, 270000, 400000, 550000],
    group: "costa",
    color: "#FFE4C4",
    description: "Balneario familiar"
  },

  // Norte (Color Terracota - #CD853F)
  {
    id: 8,
    name: "Salta",
    type: "PROPERTY",
    price: 220000,
    rent: [18000, 90000, 250000, 700000, 875000, 1050000],
    group: "norte",
    color: "#CD853F",
    description: "La linda"
  },
  {
    id: 9,
    name: "Tucumán",
    type: "PROPERTY",
    price: 240000,
    rent: [20000, 100000, 300000, 750000, 925000, 1100000],
    group: "norte",
    color: "#CD853F",
    description: "Jardín de la República"
  },
  {
    id: 10,
    name: "Jujuy",
    type: "PROPERTY",
    price: 260000,
    rent: [22000, 110000, 330000, 800000, 975000, 1150000],
    group: "norte",
    color: "#CD853F",
    description: "Quebrada de Humahuaca"
  },

  // Cuyo (Color Vino - #722F37)
  {
    id: 11,
    name: "Mendoza",
    type: "PROPERTY",
    price: 280000,
    rent: [24000, 120000, 360000, 850000, 1025000, 1200000],
    group: "cuyo",
    color: "#722F37",
    description: "Capital del vino"
  },
  {
    id: 12,
    name: "San Juan",
    type: "PROPERTY",
    price: 300000,
    rent: [26000, 130000, 390000, 900000, 1100000, 1275000],
    group: "cuyo",
    color: "#722F37",
    description: "Valle del sol"
  },
  {
    id: 13,
    name: "San Luis",
    type: "PROPERTY",
    price: 320000,
    rent: [28000, 150000, 450000, 1000000, 1200000, 1400000],
    group: "cuyo",
    color: "#722F37",
    description: "Sierras puntanas"
  },

  // Buenos Aires (Color Verde - #228B22)
  {
    id: 14,
    name: "La Plata",
    type: "PROPERTY",
    price: 350000,
    rent: [35000, 175000, 500000, 1100000, 1300000, 1500000],
    group: "bsas",
    color: "#228B22",
    description: "Ciudad de las diagonales"
  },
  {
    id: 15,
    name: "Tigre",
    type: "PROPERTY",
    price: 400000,
    rent: [40000, 200000, 600000, 1400000, 1700000, 2000000],
    group: "bsas",
    color: "#228B22",
    description: "Delta y parques"
  },

  // Servicios Públicos
  {
    id: 16,
    name: "Agua y Energía",
    type: "UTILITY",
    price: 150000,
    multiplier: [4, 10],
    description: "Servicios básicos"
  },

  // Patagonia (Color Azul Glaciar - #B0E0E6)
  {
    id: 4,
    name: "Bariloche",
    type: "PROPERTY",
    price: 140000,
    rent: [10000, 50000, 150000, 450000, 625000, 750000],
    group: "patagonia",
    color: "#B0E0E6",
    description: "Lagos y montañas"
  },
  {
    id: 5,
    name: "Calafate",
    type: "PROPERTY",
    price: 160000,
    rent: [12000, 60000, 180000, 500000, 700000, 900000],
    group: "patagonia",
    color: "#B0E0E6",
    description: "Glaciar Perito Moreno"
  },
  {
    id: 6,
    name: "Ushuaia",
    type: "PROPERTY",
    price: 180000,
    rent: [14000, 70000, 200000, 550000, 750000, 950000],
    group: "patagonia",
    color: "#B0E0E6",
    description: "Fin del mundo"
  },
  {
    id: 7,
    name: "Aeropuerto Ezeiza",
    type: "RAILROAD",
    price: 200000,
    rent: [25000, 50000, 100000, 200000],
    description: "Puerta de entrada al país"
  },
  {
    id: 6,
    name: "Puerto Madero",
    type: "PROPERTY",
    price: 100000,
    rent: [6000, 30000, 90000, 270000, 400000, 550000],
    group: "bsas",
    color: "#228B22",
    description: "Distrito más exclusivo de CABA"
  },
  
  // Esquina inferior izquierda - Cárcel
  {
    id: 7,
    name: "CÁRCEL",
    type: "JAIL",
    description: "Solo de visita o preso"
  },
  
  // Lado izquierdo (abajo hacia arriba)
  {
    id: 8,
    name: "Recoleta",
    type: "PROPERTY",
    price: 140000,
    rent: [10000, 50000, 150000, 450000, 625000, 750000],
    group: "bsas",
    color: "#228B22",
    description: "Barrio aristocrático"
  },
  {
    id: 9,
    name: "Empresa YPF",
    type: "UTILITY",
    price: 150000,
    description: "Compañía petrolera nacional"
  },
  {
    id: 10,
    name: "Belgrano",
    type: "PROPERTY",
    price: 140000,
    rent: [10000, 50000, 150000, 450000, 625000, 750000],
    group: "bsas",
    color: "#228B22",
    description: "Zona residencial premium"
  },
  {
    id: 11,
    name: "Núñez",
    type: "PROPERTY",
    price: 160000,
    rent: [12000, 60000, 180000, 500000, 700000, 900000],
    group: "bsas",
    color: "#228B22",
    description: "Barrio familiar exclusivo"
  },
  {
    id: 12,
    name: "Terminal Retiro",
    type: "RAILROAD",
    price: 200000,
    rent: [25000, 50000, 100000, 200000],
    description: "Principal estación de trenes"
  },
  {
    id: 13,
    name: "Córdoba Capital",
    type: "PROPERTY",
    price: 180000,
    rent: [14000, 70000, 200000, 550000, 750000, 950000],
    group: "centro",
    color: "#DEB887",
    description: "La Docta - Ciudad universitaria"
  },
  
  // Esquina superior izquierda - Estacionamiento libre
  {
    id: 14,
    name: "ESTACIONAMIENTO LIBRE",
    type: "FREE_PARKING",
    description: "Lugar de descanso, sin acciones"
  },
  
  // Lado superior (izquierda a derecha)
  {
    id: 15,
    name: "Rosario",
    type: "PROPERTY",
    price: 220000,
    rent: [18000, 90000, 250000, 700000, 875000, 1050000],
    group: "centro",
    color: "#DEB887",
    description: "Cuna de la bandera"
  },
  {
    id: 16,
    name: "Destino",
    type: "CHANCE",
    description: "Eventos inesperados del país"
  },
  {
    id: 17,
    name: "Mendoza",
    type: "PROPERTY",
    price: 220000,
    rent: [18000, 90000, 250000, 700000, 875000, 1050000],
    group: "red",
    description: "Tierra del vino"
  },
  {
    id: 18,
    name: "Bariloche",
    type: "PROPERTY",
    price: 240000,
    rent: [20000, 100000, 300000, 750000, 925000, 1100000],
    group: "red",
    description: "Destino turístico patagónico"
  },
  {
    id: 19,
    name: "Subte Línea D",
    type: "RAILROAD",
    price: 200000,
    rent: [25000, 50000, 100000, 200000],
    description: "Transporte público porteño"
  },
  {
    id: 20,
    name: "Salta",
    type: "PROPERTY",
    price: 260000,
    rent: [22000, 110000, 330000, 800000, 975000, 1150000],
    group: "yellow",
    description: "La Linda del Norte"
  },
  
  // Esquina superior derecha - Ve a la cárcel
  {
    id: 21,
    name: "VE A LA CÁRCEL",
    type: "GO_TO_JAIL",
    description: "Ve directo a la cárcel"
  },
  
  // Lado derecho (arriba hacia abajo)
  {
    id: 22,
    name: "Mar del Plata",
    type: "PROPERTY",
    price: 300000,
    rent: [26000, 130000, 390000, 900000, 1100000, 1275000],
    group: "green",
    description: "La Feliz - Capital del turismo"
  },
  {
    id: 23,
    name: "Caja Comunitaria",
    type: "COMMUNITY_CHEST",
    description: "Saca una carta de eventos"
  },
  {
    id: 24,
    name: "Villa Carlos Paz",
    type: "PROPERTY",
    price: 300000,
    rent: [26000, 130000, 390000, 900000, 1100000, 1275000],
    group: "green",
    description: "Villa serrana cordobesa"
  },
  {
    id: 25,
    name: "Ushuaia",
    type: "PROPERTY",
    price: 320000,
    rent: [28000, 150000, 450000, 1000000, 1200000, 1400000],
    group: "green",
    description: "Fin del mundo"
  },
  {
    id: 26,
    name: "Tren a Tigre",
    type: "RAILROAD",
    price: 200000,
    rent: [25000, 50000, 100000, 200000],
    description: "Conexión al delta"
  },
  {
    id: 27,
    name: "Destino",
    type: "CHANCE",
    description: "Eventos inesperados del país"
  }
];


// Grupos de propiedades por regiones
export const propertyGroups = {
  costa: { color: "#FFE4C4", name: "Costa Atlántica" },
  patagonia: { color: "#B0E0E6", name: "Patagonia" },
  norte: { color: "#CD853F", name: "Norte" },
  cuyo: { color: "#722F37", name: "Cuyo" },
  bsas: { color: "#228B22", name: "Buenos Aires" },
  centro: { color: "#DEB887", name: "Centro" }
};

// Servicios públicos
export const utilities = [
  { id: 9, name: "YPF", type: "oil" },
  { id: 16, name: "Edesur", type: "electricity" }
];

// Transportes
export const railroads = [
  { id: 5, name: "Aeropuerto Ezeiza" },
  { id: 12, name: "Terminal Retiro" },
  { id: 19, name: "Subte Línea D" },
  { id: 26, name: "Tren a Tigre" }
];
