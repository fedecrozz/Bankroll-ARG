// Cartas de eventos con temática argentina actual
export const communityChestCards = [
  {
    id: 1,
    title: "Bono Fiscal",
    description: "El gobierno te otorga un bono por buena conducta fiscal.",
    action: "COLLECT",
    amount: 50000
  },
  {
    id: 2,
    title: "Multa de Tránsito",
    description: "Te multaron por estacionar mal en microcentro.",
    action: "PAY",
    amount: 15000
  },
  {
    id: 3,
    title: "Reintegro de Compras",
    description: "Ahora 12 te devuelve parte de tus compras.",
    action: "COLLECT",
    amount: 25000
  },
  {
    id: 4,
    title: "Impuesto a los Débitos",
    description: "Te cobraron el impuesto al cheque.",
    action: "PAY",
    amount: 10000
  },
  {
    id: 5,
    title: "Subsidio por Desempleo",
    description: "Recibís ayuda del Estado.",
    action: "COLLECT",
    amount: 30000
  },
  {
    id: 6,
    title: "Error Bancario",
    description: "Error bancario a tu favor.",
    action: "COLLECT",
    amount: 20000
  },
  {
    id: 7,
    title: "Contribuciones Especiales",
    description: "Pagas contribuciones a la seguridad social.",
    action: "PAY",
    amount: 40000
  },
  {
    id: 8,
    title: "Programa Procrear",
    description: "Te aprueban un crédito hipotecario.",
    action: "COLLECT",
    amount: 100000
  },
  {
    id: 9,
    title: "Servicios Públicos",
    description: "Llegó una factura de luz muy cara.",
    action: "PAY",
    amount: 35000
  },
  {
    id: 10,
    title: "Monotributo",
    description: "Pagás la cuota mensual del monotributo.",
    action: "PAY",
    amount: 18000
  },
  {
    id: 11,
    title: "Trabajo en Negro",
    description: "Te ofrecen trabajo no registrado. Vas a la cárcel por evasión.",
    action: "GO_TO_JAIL"
  },
  {
    id: 12,
    title: "Tarjeta Alimentar",
    description: "Recibís ayuda alimentaria del gobierno.",
    action: "COLLECT",
    amount: 45000
  },
  {
    id: 13,
    title: "Donación a Caridad",
    description: "Donás a comedores comunitarios.",
    action: "PAY",
    amount: 25000
  },
  {
    id: 14,
    title: "Salís de la Cárcel",
    description: "Esta carta te permite salir gratis de la cárcel.",
    action: "GET_OUT_OF_JAIL_FREE"
  },
  {
    id: 15,
    title: "Fondo de Garantía",
    description: "Recuperás dinero de un fondo de garantía.",
    action: "COLLECT",
    amount: 55000
  },
  {
    id: 16,
    title: "Reparaciones",
    description: "Reparás todas tus propiedades tras las lluvias.",
    action: "PAY_PER_HOUSE",
    amount: 25000,
    hotelAmount: 100000
  }
];

export const chanceCards = [
  {
    id: 1,
    title: "Crisis Económica",
    description: "Devaluación del peso. Perdés el 20% de tu dinero.",
    action: "PAY_PERCENTAGE",
    percentage: 20
  },
  {
    id: 2,
    title: "Boom Sojero",
    description: "Buena cosecha de soja. El campo te paga dividendos.",
    action: "COLLECT",
    amount: 150000
  },
  {
    id: 3,
    title: "Corte de Luz",
    description: "Apagón en todo el país. Perdés un turno.",
    action: "LOSE_TURN"
  },
  {
    id: 4,
    title: "Mundial de Fútbol",
    description: "Argentina campeón. Todos te pagan $30.000.",
    action: "COLLECT_FROM_ALL",
    amount: 30000
  },
  {
    id: 5,
    title: "Inflación Descontrolada",
    description: "Los precios se disparan. Pagás $80.000.",
    action: "PAY",
    amount: 80000
  },
  {
    id: 6,
    title: "Mercado Libre IPO",
    description: "Invertiste en tecnología argentina.",
    action: "COLLECT",
    amount: 200000
  },
  {
    id: 7,
    title: "Piquete en 9 de Julio",
    description: "No podés moverte. Perdés el próximo turno.",
    action: "LOSE_TURN"
  },
  {
    id: 8,
    title: "Descubrimiento de Litio",
    description: "Nueva mina en tu provincia.",
    action: "COLLECT",
    amount: 175000
  },
  {
    id: 9,
    title: "Cepo Cambiario",
    description: "No podés comprar dólares. Pagás multa.",
    action: "PAY",
    amount: 60000
  },
  {
    id: 10,
    title: "Vaca Muerta",
    description: "Explotación de gas no convencional.",
    action: "COLLECT",
    amount: 120000
  },
  {
    id: 11,
    title: "Evasión Fiscal",
    description: "Te agarró la AFIP. Ve directo a la cárcel.",
    action: "GO_TO_JAIL"
  },
  {
    id: 12,
    title: "Exportación de Carne",
    description: "Buen precio internacional de la carne.",
    action: "COLLECT",
    amount: 90000
  },
  {
    id: 13,
    title: "Sequía en la Pampa",
    description: "Mala cosecha afecta la economía.",
    action: "PAY",
    amount: 70000
  },
  {
    id: 14,
    title: "Salís de la Cárcel",
    description: "Esta carta te permite salir gratis de la cárcel.",
    action: "GET_OUT_OF_JAIL_FREE"
  },
  {
    id: 15,
    title: "Turismo Post-Pandemia",
    description: "Vuelven los turistas extranjeros.",
    action: "COLLECT",
    amount: 85000
  },
  {
    id: 16,
    title: "Riesgo País Alto",
    description: "Sube el riesgo país. Nadie invierte.",
    action: "PAY",
    amount: 100000
  }
];

// Función para barajar cartas
export function shuffleCards(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
