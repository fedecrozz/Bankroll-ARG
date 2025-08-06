// Definiciones de los 28 casilleros del tablero con temática argentina actual
export const boardSpaces = [
  // Esquina inferior derecha - Inicio
  {
    id: 0,
    name: "LARGADA",
    type: "START",
    description: "Cobra $200.000 cada vez que pases",
    color: "#00FF00"
  },
  
  // Lado inferior (derecha a izquierda)
  {
    id: 1,
    name: "Barrio de Palermo",
    type: "PROPERTY",
    price: 60000,
    rent: [2000, 10000, 30000, 90000, 160000, 250000],
    group: "brown",
    description: "Zona trendy de Buenos Aires"
  },
  {
    id: 2,
    name: "Caja Comunitaria",
    type: "COMMUNITY_CHEST",
    description: "Saca una carta de eventos"
  },
  {
    id: 3,
    name: "Villa Crespo",
    type: "PROPERTY",
    price: 60000,
    rent: [4000, 20000, 60000, 180000, 320000, 450000],
    group: "brown",
    description: "Barrio en desarrollo"
  },
  {
    id: 4,
    name: "Impuesto a las Ganancias",
    type: "TAX",
    amount: 20000,
    description: "Pagar impuestos al Estado"
  },
  {
    id: 5,
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
    group: "lightblue",
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
    group: "pink",
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
    group: "pink",
    description: "Zona residencial premium"
  },
  {
    id: 11,
    name: "Núñez",
    type: "PROPERTY",
    price: 160000,
    rent: [12000, 60000, 180000, 500000, 700000, 900000],
    group: "pink",
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
    group: "orange",
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
    group: "red",
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


// Grupos de propiedades
export const propertyGroups = {
  brown: { color: "#8B4513", name: "Barrios Emergentes" },
  lightblue: { color: "#87CEEB", name: "Zona Puerto" },
  pink: { color: "#FF69B4", name: "Barrios Premium" },
  orange: { color: "#FFA500", name: "Interior Norte" },
  red: { color: "#FF0000", name: "Ciudades Principales" },
  yellow: { color: "#FFFF00", name: "Norte Argentino" },
  green: { color: "#008000", name: "Destinos Turísticos" },
  darkblue: { color: "#0000FF", name: "Lugares Únicos" }
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
