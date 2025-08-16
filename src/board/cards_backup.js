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
    title: "Dividendos",
    description: "Tus inversiones en la bolsa dieron frutos.",
    action: "COLLECT",
    amount: 60000
  },
  {
    id: 13,
    title: "Ganancias AFIP",
    description: "AFIP te reclama impuesto a las ganancias.",
    action: "PAY",
    amount: 45000
  },
  {
    id: 14,
    title: "Aguinaldo",
    description: "Cobrás el aguinaldo de fin de año.",
    action: "COLLECT",
    amount: 75000
  },
  {
    id: 15,
    title: "Medicina Prepaga",
    description: "Renovás la medicina prepaga familiar.",
    action: "PAY",
    amount: 25000
  },
  {
    id: 16,
    title: "Bono de Productividad",
    description: "Te dan un bono por buen rendimiento laboral.",
    action: "COLLECT",
    amount: 55000
  }
];

export const chanceCards = [
  {
    id: 1,
    title: "Devaluación",
    description: "El peso se devalúa 30%. Perdés dinero.",
    action: "PAY_PERCENTAGE",
    percentage: 30
  },
  {
    id: 2,
    title: "Inflación Mensual",
    description: "La inflación se come tus ahorros.",
    action: "PAY",
    amount: 50000
  },
  {
    id: 3,
    title: "Dólar Turista",
    description: "Te cobran impuesto por comprar dólares.",
    action: "PAY",
    amount: 35000
  },
  {
    id: 4,
    title: "Bonos del Estado",
    description: "Invertiste en LELIQs y ganaste.",
    action: "COLLECT",
    amount: 70000
  },
  {
    id: 5,
    title: "Plan Trabajar",
    description: "Te incluyen en un plan social.",
    action: "COLLECT",
    amount: 40000
  },
  {
    id: 6,
    title: "Corralito Bancario",
    description: "No podés sacar dinero del banco.",
    action: "LOSE_TURN"
  },
  {
    id: 7,
    title: "Blanqueo de Capitales",
    description: "Regularizás tu situación fiscal.",
    action: "GET_OUT_OF_JAIL_FREE"
  },
  {
    id: 8,
    title: "Fuga de Capitales",
    description: "Tus dólares se fueron al exterior.",
    action: "PAY",
    amount: 80000
  },
  {
    id: 9,
    title: "Préstamo FMI",
    description: "El país recibe dólares del FMI. Todos cobran.",
    action: "COLLECT_FROM_ALL",
    amount: 30000
  },
  {
    id: 10,
    title: "Cepo Cambiario",
    description: "No podés comprar dólares. Perdés turno.",
    action: "LOSE_TURN"
  },
  {
    id: 11,
    title: "Mercado Libre",
    description: "Vendiste productos online y ganaste.",
    action: "COLLECT",
    amount: 65000
  },
  {
    id: 12,
    title: "Tarjeta de Crédito",
    description: "Te aumentaron el límite y gastaste más.",
    action: "PAY",
    amount: 55000
  },
  {
    id: 13,
    title: "Crypto Rally",
    description: "Tus bitcoins subieron de precio.",
    action: "COLLECT",
    amount: 90000
  },
  {
    id: 14,
    title: "Patente del Auto",
    description: "Llegó el impuesto automotor.",
    action: "PAY",
    amount: 42000
  },
  {
    id: 15,
    title: "Fintech Argentina",
    description: "Invertiste en una startup exitosa.",
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

// Cartas de Destino - Eventos aleatorios del país (14 cartas)
export const destinyCards = [
  // Beneficios moderados (4 cartas)
  {
    id: 1,
    title: "🎰 Bingo Beneficencia",
    description: "Ganaste en el bingo de la iglesia del barrio.",
    action: "COLLECT",
    amount: 120000
  },
  {
    id: 2,
    title: "💰 Reintegro ANSES",
    description: "ANSES te devuelve aportes mal calculados.",
    action: "COLLECT",
    amount: 150000
  },
  {
    id: 3,
    title: "💸 Dólar Blue Subió",
    description: "Vendiste dólares cuando subió el blue.",
    action: "COLLECT",
    amount: 180000
  },
  {
    id: 4,
    title: "🎊 Herencia Familiar",
    description: "Un tío lejano te dejó una herencia.",
    action: "COLLECT",
    amount: 250000
  },

  // Contras moderadas (4 cartas)
  {
    id: 5,
    title: "🏥 Obra Social",
    description: "Pagas la cuota de obra social atrasada.",
    action: "PAY",
    amount: 80000
  },
  {
    id: 6,
    title: "📱 Robo de Celular",
    description: "Te robaron el celular en el transporte público.",
    action: "PAY",
    amount: 120000
  },
  {
    id: 7,
    title: "💳 Resumen de Tarjeta",
    description: "Te vino el resumen de la tarjeta con intereses.",
    action: "PAY",
    amount: 140000
  },
  {
    id: 8,
    title: "🚨 Seguro Automotor",
    description: "Renovaste el seguro del auto.",
    action: "PAY",
    amount: 105000
  },

  // Acciones especiales competitivas (6 cartas)
  {
    id: 9,
    title: "🚔 Va directo a la cárcel",
    description: "Te agarraron evadiendo impuestos. No pases por la LARGADA.",
    action: "GO_TO_JAIL"
  },
  {
    id: 10,
    title: "🎯 Vení a la LARGADA",
    description: "Una oportunidad te lleva directo al comienzo.",
    action: "GO_TO_START"
  },
  {
    id: 11,
    title: "💎 Descuento en Propiedades",
    description: "Conseguiste un descuento del 50% en cualquier propiedad libre.",
    action: "DISCOUNT_PROPERTY",
    discount: 50
  },
  {
    id: 12,
    title: "💸 Impuesto a la Riqueza",
    description: "Pagás el 15% de tu dinero en efectivo al jugador más pobre.",
    action: "PAY_TO_POOREST",
    percentage: 15
  },
  {
    id: 13,
    title: "🎲 Tirada Extra",
    description: "La suerte te sonríe. Tirás dados nuevamente en este turno.",
    action: "EXTRA_ROLL"
  },
  {
    id: 14,
    title: "🏦 Crisis Bancaria",
    description: "Todos los jugadores pierden el 10% de su dinero.",
    action: "ALL_PAY_PERCENTAGE",
    percentage: 10
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
