import { NewsArticle, AnalyticsMetric } from "./types";

export interface SpecialCalendarDate {
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: "EVENTO" | "COMEMORATIVA" | "LANÇAMENTO" | "PODCAST" | "WORKSHOP";
  description: string;
  icon?: string;
  location?: string;
}

export const SPECIAL_DATES_CATALOG: SpecialCalendarDate[] = [
  {
    dateStr: "2026-08-09",
    title: "Especial Dia dos Pais: Empreendedorismo Familiar",
    category: "COMEMORATIVA",
    description: "Homenagem especial e rodada de pautas sobre negócios de família na Zona da Mata.",
    icon: "❤️",
    location: "Juiz de Fora e Região"
  },
  {
    dateStr: "2026-08-15",
    title: "Feira Regional de Inovação & Tecnologia",
    category: "EVENTO",
    description: "Exposição de startups, marcas locais e aceleradoras de negócios no Sudeste de Minas.",
    icon: "💡",
    location: "Juiz de Fora"
  },
  {
    dateStr: "2026-08-17",
    title: "Grande Encontro Regional de Negócios & Rodada de Conexões",
    category: "EVENTO",
    description: "Encontro estratégico presencial reuniando empreendedoras, investidores e o Conselho de Embaixadores no Independência Trade Hotel.",
    icon: "🚀",
    location: "Independência Trade Hotel - Juiz de Fora"
  },
  {
    dateStr: "2026-08-22",
    title: "Workshop: Posicionamento Digital e Alta Performance",
    category: "WORKSHOP",
    description: "Treinamento exclusivo focado em estratégias de vendas digitais e branding pessoal para acelerar marcas.",
    icon: "🎓",
    location: "Auditório Do Começo Ao Topo"
  },
  {
    dateStr: "2026-08-31",
    title: "Lançamento Oficial do Portal de Negócios Do Começo Ao Topo",
    category: "LANÇAMENTO",
    description: "Abertura oficial do ecossistema completo para acelerar o empreendedorismo feminino no Sudeste de Minas.",
    icon: "👑",
    location: "Juiz de Fora"
  },
  {
    dateStr: "2026-09-07",
    title: "Especial Independência: Autonomia Financeira Feminina",
    category: "COMEMORATIVA",
    description: "Painéis e reportagens dedicadas ao protagonismo feminino e libertação financeira.",
    icon: "🇧🇷",
    location: "Zona da Mata"
  },
  {
    dateStr: "2026-10-05",
    title: "Dia Nacional do Micro e Pequeno Empreendedor",
    category: "COMEMORATIVA",
    description: "Dia dedicado a celebrar as pequenas empresas que movem a economia do Brasil.",
    icon: "💼",
    location: "Nacional"
  }
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: "art-evento-17-agosto",
    title: "17/08: GRANDE ENCONTRO REGIONAL DE NEGÓCIOS & RODADA DE CONEXÕES",
    excerpt: "Evento presencial reúne mais de 150 empreendedoras e investidores no Independência Trade Hotel.",
    content: "No dia 17 de Agosto de 2026, o Portal Do Começo ao Topo promove o Grande Encontro Regional de Negócios e Rodada de Conexões. Um espaço exclusivo de networking qualificado, apresentação de marcas apoiadoras e pitch de novos projetos da Zona da Mata e Juiz de Fora.",
    category: "EVENTOS",
    author: "Conselho Editorial",
    date: "2026-08-17T14:00:00Z",
    readTime: "4 min",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    views: 1850,
    shares: 142,
    likes: 520,
    isPremium: false,
    location: "Juiz de Fora",
    tags: ["Evento", "Networking", "17 de Agosto", "Rodada de Negócios", "Independência Trade Hotel"],
    commentsCount: 26
  },
  {
    id: "art-dia-dos-pais-9-agosto",
    title: "09/08: ESPECIAL DIA DOS PAIS - EMPREENDEDORISMO FAMILIAR QUE INSPIRA",
    excerpt: "Histórias de pais e mães que construíram negócios prósperos lado a lado na Zona da Mata.",
    content: "No dia 09 de Agosto, celebramos o Dia dos Pais com uma cobertura especial sobre liderança, valores e empresas familiares que são referência na região. Conheça trajetórias inspiradoras de empreendedores que transformaram trabalho árduo em legado familiar.",
    category: "NOTÍCIAS",
    author: "Redação Do Começo ao Topo",
    date: "2026-08-09T09:00:00Z",
    readTime: "5 min",
    imageUrl: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&w=1200&q=80",
    views: 1420,
    shares: 98,
    likes: 410,
    isPremium: false,
    location: "Juiz de Fora",
    tags: ["Dia dos Pais", "Especial", "09 de Agosto", "Família", "Negócios"],
    commentsCount: 19
  },
  {
    id: "art-feira-inovacao-15-agosto",
    title: "15/08: FEIRA REGIONAL DE INOVAÇÃO, TECNOLOGIA & NEGÓCIOS",
    excerpt: "Startups e empresas locais apresentam soluções tecnológicas aplicadas ao comércio e serviços.",
    content: "A feira traz estandes interativos, demonstração de inteligência artificial aplicada ao varejo local e oficinas gratuitas para empreendedoras de Juiz de Fora e cidades vizinhas.",
    category: "EVENTOS",
    author: "Curadoria de Tecnologia",
    date: "2026-08-15T10:00:00Z",
    readTime: "3 min",
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    views: 980,
    shares: 64,
    likes: 290,
    isPremium: false,
    location: "Juiz de Fora",
    tags: ["Inovação", "Feira", "15 de Agosto", "Tecnologia", "Zona da Mata"],
    commentsCount: 12
  },
  {
    id: "art-workshop-22-agosto",
    title: "22/08: WORKSHOP POSICIONAMENTO DIGITAL E ALTA PERFORMANCE",
    excerpt: "Treinamento prático de branding, mídias sociais e técnicas de negociação para mulheres de negócios.",
    content: "Inscreva-se para o workshop presencial do dia 22 de Agosto e descubra como criar autoridade, atrair clientes qualificados pelo Instagram e estruturar processos de vendas de alta margem.",
    category: "CURSOS",
    author: "Mentoria VIP",
    date: "2026-08-22T08:30:00Z",
    readTime: "4 min",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    views: 1150,
    shares: 77,
    likes: 380,
    isPremium: false,
    location: "Juiz de Fora",
    tags: ["Workshop", "Cursos", "22 de Agosto", "Posicionamento", "Vendas"],
    commentsCount: 15
  },
  {
    id: "art-lancamento-portal",
    title: "31/08: LANÇAMENTO OFICIAL DO PORTAL DE NEGÓCIOS DO COMEÇO AO TOPO",
    excerpt: "Conectando Empreendedoras, Oportunidades e Crescimento.",
    content: "O Lançamento Oficial do Portal de Negócios marca um novo capítulo para o empreendedorismo regional. Um ecossistema completo para conectar mulheres de negócios, acelerar marcas, promover networking qualificado e impulsionar o desenvolvimento econômico local em Juiz de Fora e Zona da Mata.",
    category: "EVENTOS",
    author: "Andeson",
    date: "2026-08-31T19:00:00Z",
    readTime: "3 min",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    views: 2140,
    shares: 185,
    likes: 642,
    isPremium: false,
    location: "Juiz de Fora",
    tags: ["Empreendedorismo", "Negócios", "Lançamento", "31 de Agosto", "Networking"],
    commentsCount: 34
  },
  {
    id: "art-podcast-topo",
    title: "DO COMEÇO AO TOPO: HISTÓRIAS QUE INSPIRAM",
    excerpt: "Inspirando e acelerando pessoas através de histórias de superação e trajetórias reais.",
    content: "Cada episódio do podcast é pensado para levar conhecimento, experiências e aprendizados que possam incentivar pessoas a acreditarem no seu potencial, desenvolverem seus negócios e crescerem com propósito.",
    category: "PODCAST",
    author: "Equipe Editorial",
    date: "2026-07-24T10:00:00Z",
    readTime: "4 min",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    views: 890,
    shares: 45,
    likes: 210,
    isPremium: false,
    location: "Minas Gerais",
    tags: ["Podcast", "Inspiração", "Carreira", "Julho"],
    commentsCount: 8
  },
  {
    id: "art-comunidade-vip",
    title: "COMUNIDADE VIP DO COMEÇO AO TOPO: ACESSO A MENTORIAS & CONEXÕES",
    excerpt: "Descubra todos os benefícios de fazer parte da rede oficial de membros e empreendedores da Zona da Mata.",
    content: "A Comunidade VIP é o coração do ecossistema Do Começo ao Topo. Espaço de trocas de alto valor, mentoria direta, indicação de negócios e acesso prioritário a rodadas de investimento e eventos em Juiz de Fora e cidades vizinhas.",
    category: "COMUNIDADE",
    author: "Diretoria VIP",
    date: "2026-08-01T10:00:00Z",
    readTime: "5 min",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    views: 1540,
    shares: 112,
    likes: 480,
    isPremium: true,
    location: "Juiz de Fora",
    tags: ["Comunidade VIP", "Mentoria", "Networking", "Zona da Mata"],
    commentsCount: 22
  },
  {
    id: "art-embaixadores-vip",
    title: "PROGRAMA DE EMBAIXADORAS REGIONAIS: LIDERANDO A TRANSFORMAÇÃO ECONÔMICA",
    excerpt: "Conheça o papel estratégico dos embaixadores na conexão entre liderança feminina, empresas e inovação.",
    content: "O corpo de Embaixadores Regionais reúne líderes e empresários de destaque que apadrinham novos empreendimentos, representam a marca na Zona da Mata e impulsionam o crescimento sustentável de negócios locais.",
    category: "EMBAIXADORES",
    author: "Conselho de Embaixadores",
    date: "2026-08-03T11:30:00Z",
    readTime: "4 min",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    views: 1780,
    shares: 135,
    likes: 560,
    isPremium: true,
    location: "Juiz de Fora",
    tags: ["Embaixadores", "Liderança", "VIP", "Zona da Mata"],
    commentsCount: 19
  },
  {
    id: "art-tour-guiado",
    title: "TOUR GUIADO PELO PORTAL: CONHEÇA TODAS AS MÍDIAS E FERRAMENTAS",
    excerpt: "Navegue pelo ecossistema regional de oportunidades, rádios, rádio estúdio e rodadas de negócios.",
    content: "Seja bem-vindo ao Portal Do Começo ao Topo! Neste Tour Guiado, você descobre como cadastrar sua empresa no catálogo interativo, participar dos podcasts semanais, acompanhar a agenda de eventos da Zona da Mata e expandir sua presença.",
    category: "TOUR",
    author: "Equipe do Portal",
    date: "2026-08-05T09:00:00Z",
    readTime: "3 min",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    views: 1290,
    shares: 88,
    likes: 390,
    isPremium: false,
    location: "Zona da Mata",
    tags: ["Tour", "Onde Estamos", "Tutorial", "Portal"],
    commentsCount: 14
  }
];

export const INITIAL_ANALYTICS: AnalyticsMetric[] = [];

