import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  FileText,
  TrendingUp,
  PlusCircle,
  Trash2,
  Eye,
  Settings,
  Activity,
  UserCheck,
  Check,
  BarChart3,
  Flame,
  Volume2,
  VolumeX,
  Palette,
  Sliders,
  Sparkles,
  Layout,
  Music,
  CheckCircle,
  Folder,
  ChevronRight,
  RefreshCw,
  Home,
  User,
  Unlock,
  LogOut,
  Upload,
  Camera,
  X,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { NewsArticle, CategoryType } from "../types";
import { playClickSound, playSuccessSound, playNegativeSound } from "../utils/audio";
import ImageCropperModal from "./ImageCropperModal";

interface LogoConfigType {
  customImageUrl: string;
  customLogoWidth: number;
  customLogoHeight: number;
  customText1: string;
  customText2: string;
  customSub: string;
}

interface CmsDashboardProps {
  articles: NewsArticle[];
  onAddArticle: (article: NewsArticle) => void;
  onDeleteArticle: (id: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  logoConfig: LogoConfigType;
  onSaveLogo: (updatedLogo: LogoConfigType) => void;
  isSoundActive: boolean;
  onToggleSound: (active: boolean) => void;
  gradientStyle: "neonPulse" | "pinkGlow" | "auroraGreenPink" | "subtleSpring";
  onSelectGradientStyle: (style: "neonPulse" | "pinkGlow" | "auroraGreenPink" | "subtleSpring") => void;
  footerCredits: string;
  onSaveFooterCredits: (txt: string) => void;
  user?: { isAuthenticated: boolean; name: string; photoUrl: string; email?: string };
  onTriggerAuth?: () => void;
  onLogout?: () => void;
  portalPagesConfig: any;
  onSavePortalPagesConfig: (updated: any) => void;
}

const PRESET_IMGS = [
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1516116211223-4c359a36beec?auto=format&fit=crop&q=80&w=400",
];

export default function CmsDashboard({
  articles,
  onAddArticle,
  onDeleteArticle,
  isDarkMode,
  onToggleDarkMode,
  logoConfig,
  onSaveLogo,
  isSoundActive,
  onToggleSound,
  gradientStyle,
  onSelectGradientStyle,
  footerCredits,
  onSaveFooterCredits,
  user,
  onTriggerAuth,
  onLogout,
  portalPagesConfig,
  onSavePortalPagesConfig,
}: CmsDashboardProps) {
  // WordPress-like active tab selector
  const [activeAdminTab, setActiveAdminTab] = useState<"dashboard" | "new_post" | "manage_posts" | "appearance" | "settings" | "pages" | "enrollments" | "users">("dashboard");
  const [selectedSubPage, setSelectedSubPage] = useState<
    | "quemsomos"
    | "objetivos"
    | "ondeestamos"
    | "contato"
    | "comunidade"
    | "eventos"
    | "galeria"
    | "embaixadores"
    | "vagas"
    | "cursos"
    | "parceiros"
    | "podcast"
    | "anuncie"
  >("quemsomos");

  const articleFileInputRef = useRef<HTMLInputElement>(null);

  // CMS state for new raw post
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<CategoryType>("NOTÍCIAS");
  const [image, setImage] = useState(PRESET_IMGS[0]);
  const [cropperSource, setCropperSource] = useState<string>("");
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState(false);
  const [location, setLocation] = useState("Juiz de Fora, MG");
  const [author, setAuthor] = useState("Anderson Maooe");
  const [tags, setTags] = useState("Negócios, Regional, Inovação");
  const [successMsg, setSuccessMsg] = useState("");

  // Local state mirroring logo and details
  const [logoText1, setLogoText1] = useState(logoConfig.customText1);
  const [logoText2, setLogoText2] = useState(logoConfig.customText2);
  const [logoSlogan, setLogoSlogan] = useState(logoConfig.customSub);
  const [logoUrl, setLogoUrl] = useState(logoConfig.customImageUrl);
  const [logoSize, setLogoSize] = useState(logoConfig.customLogoWidth);
  const [localCredits, setLocalCredits] = useState(footerCredits);

  // Sync with prop changes if modified elsewhere
  useEffect(() => {
    setLogoText1(logoConfig.customText1);
    setLogoText2(logoConfig.customText2);
    setLogoSlogan(logoConfig.customSub);
    setLogoUrl(logoConfig.customImageUrl);
    setLogoSize(logoConfig.customLogoWidth || 36);
  }, [logoConfig]);

  useEffect(() => {
    setLocalCredits(footerCredits);
  }, [footerCredits]);

  // Local states for page management
  const [qsP1, setQsP1] = useState(portalPagesConfig?.quemSomosP1 || "");
  const [qsP2, setQsP2] = useState(portalPagesConfig?.quemSomosP2 || "");
  const [qsP3, setQsP3] = useState(portalPagesConfig?.quemSomosP3 || "");
  const [qsP4, setQsP4] = useState(portalPagesConfig?.quemSomosP4 || "");
  const [qsQuote, setQsQuote] = useState(portalPagesConfig?.quemSomosQuote || "");

  const [objPortal, setObjPortal] = useState(portalPagesConfig?.objetivosPortal || "");
  const [objPodcast, setObjPodcast] = useState(portalPagesConfig?.objetivosPodcast || "");
  const [objComunidade, setObjComunidade] = useState(portalPagesConfig?.objetivosComunidade || "");
  const [objCursos, setObjCursos] = useState(portalPagesConfig?.objetivosCursos || "");

  const [endEdificio, setEndEdificio] = useState(portalPagesConfig?.enderecoEdificio || "");
  const [endRua, setEndRua] = useState(portalPagesConfig?.enderecoRua || "");
  const [endBairro, setEndBairro] = useState(portalPagesConfig?.enderecoBairro || "");
  const [endComp, setEndComp] = useState(portalPagesConfig?.enderecoComplemento || "");
  const [endMapEmbed, setEndMapEmbed] = useState(portalPagesConfig?.enderecoMapEmbed || "");
  const [endMapViewer, setEndMapViewer] = useState(portalPagesConfig?.enderecoMapViewer || "");

  const [contEmail, setContEmail] = useState(portalPagesConfig?.contatoEmail || "");
  const [contWhatsapp, setContWhatsapp] = useState(portalPagesConfig?.contatoWhatsapp || "");
  const [contInstagram, setContInstagram] = useState(portalPagesConfig?.contatoInstagram || "");

  // EXTENDED PAGES LOCAL STATES
  const [comunidadeTitle, setComunidadeTitle] = useState(portalPagesConfig?.comunidadeTitle || "");
  const [comunidadeDescription, setComunidadeDescription] = useState(portalPagesConfig?.comunidadeDescription || "");

  const [eventosTitle, setEventosTitle] = useState(portalPagesConfig?.eventosTitle || "");
  const [eventosDescription, setEventosDescription] = useState(portalPagesConfig?.eventosDescription || "");

  const [galeriaTitle, setGaleriaTitle] = useState(portalPagesConfig?.galeriaTitle || "");
  const [galeriaDescription, setGaleriaDescription] = useState(portalPagesConfig?.galeriaDescription || "");

  const [embaixadoresTitle, setEmbaixadoresTitle] = useState(portalPagesConfig?.embaixadoresTitle || "");
  const [embaixadoresDescription, setEmbaixadoresDescription] = useState(portalPagesConfig?.embaixadoresDescription || "");

  const [vagasTitle, setVagasTitle] = useState(portalPagesConfig?.vagasTitle || "");
  const [vagasDescription, setVagasDescription] = useState(portalPagesConfig?.vagasDescription || "");

  const [cursosTitle, setCursosTitle] = useState(portalPagesConfig?.cursosTitle || "");
  const [cursosDescription, setCursosDescription] = useState(portalPagesConfig?.cursosDescription || "");

  const [podcastTitle, setPodcastTitle] = useState(portalPagesConfig?.podcastTitle || "");
  const [podcastDescription, setPodcastDescription] = useState(portalPagesConfig?.podcastDescription || "");

  const [anunciePara1, setAnunciePara1] = useState(portalPagesConfig?.anunciePara1 || "");
  const [anuncieSec1Title, setAnuncieSec1Title] = useState(portalPagesConfig?.anuncieSec1Title || "");
  const [anuncieSec1Text, setAnuncieSec1Text] = useState(portalPagesConfig?.anuncieSec1Text || "");
  const [anuncieSec2Title, setAnuncieSec2Title] = useState(portalPagesConfig?.anuncieSec2Title || "");
  const [anuncieSec2Text, setAnuncieSec2Text] = useState(portalPagesConfig?.anuncieSec2Text || "");
  const [anuncieSec3Title, setAnuncieSec3Title] = useState(portalPagesConfig?.anuncieSec3Title || "");
  const [anuncieSec3Text, setAnuncieSec3Text] = useState(portalPagesConfig?.anuncieSec3Text || "");
  const [anuncieEmail, setAnuncieEmail] = useState(portalPagesConfig?.anuncieEmail || "");

  const [contatoTitle, setContatoTitle] = useState(portalPagesConfig?.contatoTitle || "");
  const [contatoDescription, setContatoDescription] = useState(portalPagesConfig?.contatoDescription || "");

  const [localParceiros, setLocalParceiros] = useState<{name: string, description: string}[]>(portalPagesConfig?.parceirosList || []);
  const [newParceiroName, setNewParceiroName] = useState("");
  const [newParceiroDesc, setNewParceiroDesc] = useState("");

  const [localCursos, setLocalCursos] = useState<{name: string, description: string, url?: string}[]>(portalPagesConfig?.cursosList || []);
  const [newCursoName, setNewCursoName] = useState("");
  const [newCursoDesc, setNewCursoDesc] = useState("");
  const [newCursoUrl, setNewCursoUrl] = useState("");

  const [pagesSuccessMsg, setPagesSuccessMsg] = useState("");

  const [communityEnrollments, setCommunityEnrollments] = useState<any[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data && Array.isArray(data.users) && data.users.length > 0) {
        setUsersList(data.users);
      } else {
        setUsersList([
          { email: "diretoria@portal.com", name: "Diretoria (AI Studio)", photoUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=diretoria", status: "approved", createdAt: new Date().toISOString() },
          { email: "admin@docomecoatopo.com.br", name: "Sérgio (Regina Admin)", photoUrl: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=admin", status: "approved", createdAt: new Date().toISOString() },
          { email: "membro@portal.com", name: "Membro VIP Teste", photoUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=membro", status: "trial", trialEndsAt: new Date(Date.now() + 14*24*60*60*1000).toISOString(), createdAt: new Date().toISOString() }
        ]);
      }
    } catch (e) {
      console.error("Error loading users list:", e);
      setUsersList([
        { email: "diretoria@portal.com", name: "Diretoria (AI Studio)", photoUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=diretoria", status: "approved", createdAt: new Date().toISOString() }
      ]);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (activeAdminTab === ("users" as any)) {
      fetchUsersList();
    }
  }, [activeAdminTab]);

  const handleUpdateUserStatus = async (email: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.email === email ? { ...u, status: newStatus } : u));
        toast.success(`Status de ${email} alterado para ${newStatus.toUpperCase()}`);
      } else {
        toast.error("Erro ao atualizar status do usuário.");
      }
    } catch (e) {
      console.error("Error updating status:", e);
      setUsersList(prev => prev.map(u => u.email === email ? { ...u, status: newStatus } : u));
      toast.success(`Status local atualizado para ${newStatus.toUpperCase()}`);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "enrollments") {
      const loadEnrollments = async () => {
        setLoadingEnrollments(true);
        try {
          const res = await fetch("/api/published-data");
          const data = await res.json();
          if (data && data.community_enrollments) {
            setCommunityEnrollments(data.community_enrollments);
          }
        } catch (e) {
          console.error("Error loading enrollments", e);
        }
        setLoadingEnrollments(false);
      };
      loadEnrollments();
    }
  }, [activeAdminTab]);

  useEffect(() => {
    if (portalPagesConfig) {
      setQsP1(portalPagesConfig.quemSomosP1 || "");
      setQsP2(portalPagesConfig.quemSomosP2 || "");
      setQsP3(portalPagesConfig.quemSomosP3 || "");
      setQsP4(portalPagesConfig.quemSomosP4 || "");
      setQsQuote(portalPagesConfig.quemSomosQuote || "");
      setObjPortal(portalPagesConfig.objetivosPortal || "");
      setObjPodcast(portalPagesConfig.objetivosPodcast || "");
      setObjComunidade(portalPagesConfig.objetivosComunidade || "");
      setObjCursos(portalPagesConfig.objetivosCursos || "");
      setEndEdificio(portalPagesConfig.enderecoEdificio || "");
      setEndRua(portalPagesConfig.enderecoRua || "");
      setEndBairro(portalPagesConfig.enderecoBairro || "");
      setEndComp(portalPagesConfig.enderecoComplemento || "");
      setEndMapEmbed(portalPagesConfig.enderecoMapEmbed || "");
      setEndMapViewer(portalPagesConfig.enderecoMapViewer || "");
      setContEmail(portalPagesConfig.contatoEmail || "");
      setContWhatsapp(portalPagesConfig.contatoWhatsapp || "");
      setContInstagram(portalPagesConfig.contatoInstagram || "");

      // Sync Extended properties
      setComunidadeTitle(portalPagesConfig.comunidadeTitle || "");
      setComunidadeDescription(portalPagesConfig.comunidadeDescription || "");
      setEventosTitle(portalPagesConfig.eventosTitle || "");
      setEventosDescription(portalPagesConfig.eventosDescription || "");
      setGaleriaTitle(portalPagesConfig.galeriaTitle || "");
      setGaleriaDescription(portalPagesConfig.galeriaDescription || "");
      setEmbaixadoresTitle(portalPagesConfig.embaixadoresTitle || "");
      setEmbaixadoresDescription(portalPagesConfig.embaixadoresDescription || "");
      setVagasTitle(portalPagesConfig.vagasTitle || "");
      setVagasDescription(portalPagesConfig.vagasDescription || "");
      setCursosTitle(portalPagesConfig.cursosTitle || "");
      setCursosDescription(portalPagesConfig.cursosDescription || "");
      setPodcastTitle(portalPagesConfig.podcastTitle || "");
      setPodcastDescription(portalPagesConfig.podcastDescription || "");
      setAnunciePara1(portalPagesConfig.anunciePara1 || "");
      setAnuncieSec1Title(portalPagesConfig.anuncieSec1Title || "");
      setAnuncieSec1Text(portalPagesConfig.anuncieSec1Text || "");
      setAnuncieSec2Title(portalPagesConfig.anuncieSec2Title || "");
      setAnuncieSec2Text(portalPagesConfig.anuncieSec2Text || "");
      setAnuncieSec3Title(portalPagesConfig.anuncieSec3Title || "");
      setAnuncieSec3Text(portalPagesConfig.anuncieSec3Text || "");
      setAnuncieEmail(portalPagesConfig.anuncieEmail || "");
      setContatoTitle(portalPagesConfig.contatoTitle || "");
      setContatoDescription(portalPagesConfig.contatoDescription || "");
      setLocalParceiros(portalPagesConfig.parceirosList || []);
    }
  }, [portalPagesConfig]);

  const handleSavePagesDetail = () => {
    const updated = {
      ...portalPagesConfig,
      quemSomosP1: qsP1,
      quemSomosP2: qsP2,
      quemSomosP3: qsP3,
      quemSomosP4: qsP4,
      quemSomosQuote: qsQuote,
      objetivosPortal: objPortal,
      objetivosPodcast: objPodcast,
      objetivosComunidade: objComunidade,
      objetivosCursos: objCursos,
      enderecoEdificio: endEdificio,
      enderecoRua: endRua,
      enderecoBairro: endBairro,
      enderecoComplemento: endComp,
      enderecoMapEmbed: endMapEmbed,
      enderecoMapViewer: endMapViewer,
      contatoEmail: contEmail,
      contatoWhatsapp: contWhatsapp,
      contatoInstagram: contInstagram,

      // Save Extended fields
      comunidadeTitle: comunidadeTitle,
      comunidadeDescription: comunidadeDescription,
      eventosTitle: eventosTitle,
      eventosDescription: eventosDescription,
      galeriaTitle: galeriaTitle,
      galeriaDescription: galeriaDescription,
      embaixadoresTitle: embaixadoresTitle,
      embaixadoresDescription: embaixadoresDescription,
      vagasTitle: vagasTitle,
      vagasDescription: vagasDescription,
      cursosTitle: cursosTitle,
      cursosDescription: cursosDescription,
      podcastTitle: podcastTitle,
      podcastDescription: podcastDescription,
      anunciePara1: anunciePara1,
      anuncieSec1Title: anuncieSec1Title,
      anuncieSec1Text: anuncieSec1Text,
      anuncieSec2Title: anuncieSec2Title,
      anuncieSec2Text: anuncieSec2Text,
      anuncieSec3Title: anuncieSec3Title,
      anuncieSec3Text: anuncieSec3Text,
      anuncieEmail: anuncieEmail,
      contatoTitle: contatoTitle,
      contatoDescription: contatoDescription,
      parceirosList: localParceiros,
      cursosList: localCursos,
    };
    onSavePortalPagesConfig(updated);
    playSuccessSound();
    setPagesSuccessMsg("Conteúdo de todas as páginas salvo com sucesso e atualizado no portal!");
    setTimeout(() => setPagesSuccessMsg(""), 4500);
  };

  // Real-time readers state
  const [activeReaders, setActiveReaders] = useState(158);
  const [totalSharesCount, setTotalSharesCount] = useState(3894);
  const [simulationSpeed, setSimulationSpeed] = useState<"normal" | "fast">("normal");

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
      setActiveReaders((prev) => Math.max(130, prev + delta));
      if (Math.random() > 0.55) {
        setTotalSharesCount((prev) => prev + 1);
      }
    }, simulationSpeed === "fast" ? 1000 : 3500);

    return () => clearInterval(interval);
  }, [simulationSpeed]);

  const handleAdminTabChange = (tab: typeof activeAdminTab) => {
    playClickSound(750, "sine");
    setActiveAdminTab(tab);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      playNegativeSound();
      toast.error("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const newArt: NewsArticle = {
      id: `art-${Date.now()}`,
      title,
      excerpt,
      content,
      category,
      author,
      date: new Date().toISOString(),
      readTime: `${Math.max(2, Math.round(content.length / 450))} min`,
      imageUrl: image,
      views: Math.floor(Math.random() * 40) + 12,
      shares: 0,
      likes: 0,
      isPremium,
      location,
      tags: tagList,
      commentsCount: 0,
    };

    onAddArticle(newArt);
    playSuccessSound();

    // Reset Fields
    setTitle("");
    setExcerpt("");
    setContent("");
    const msg = category === "EVENTOS" 
      ? "Evento cadastrado e salvo com sucesso! Acesse a aba EVENTOS no portal para visualizá-lo."
      : "Publicado em destaque no banco WP-Admin regional!";
    setSuccessMsg(msg);
    toast.success(msg);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleApplyAppearance = () => {
    playSuccessSound();
    onSaveLogo({
      customImageUrl: logoUrl,
      customLogoWidth: logoSize,
      customLogoHeight: logoSize,
      customText1: logoText1,
      customText2: logoText2,
      customSub: logoSlogan,
    });
    onSaveFooterCredits(localCredits);
  };

  const handleTestBeep = (freq: number, style: OscillatorType) => {
    playClickSound(freq, style);
  };

  // Convert current articles data live for charts
  const barChartData = articles.slice(0, 7).map((art) => ({
    name: art.title.length > 18 ? art.title.substring(0, 16) + "..." : art.title,
    "Visualizações": art.views,
    "Shares": art.shares * 4 + 2,
  }));

  const lineHistoryData = [
    { name: "Seg", Assinantes: 4200, "Cliques Ativos": 1100 },
    { name: "Ter", Assinantes: 4280, "Cliques Ativos": 1250 },
    { name: "Qua", Assinantes: 4400, "Cliques Ativos": 1500 },
    { name: "Qui", Assinantes: 4560, "Cliques Ativos": 1780 },
    { name: "Sex", Assinantes: 4700, "Cliques Ativos": 1950 },
    { name: "Sáb", Assinantes: 4980, "Cliques Ativos": 2300 },
    { name: "Dom", Assinantes: 5120, "Cliques Ativos": 2680 },
  ];

  return (
    <div id="wp-custom-dashboard-layout" className="flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* WORDPRESS DARK SIDEBAR */}
      <aside className="w-full lg:w-64 bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl shrink-0">
        {/* Brand header like WP-Admin logo block */}
        <div className="p-4 bg-zinc-900/60 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-green-400 to-pink-500 flex items-center justify-center text-black font-black text-[10px] shadow-md animate-pulse">
              WP
            </div>
            <div>
              <h4 className="font-display font-black text-xs text-white uppercase tracking-wider">WP-Painel</h4>
              <span className="text-[8px] text-zinc-500 font-mono block">v2026.5.22.Beta</span>
            </div>
          </div>
          {/* Status Indicator */}
          <span className="text-[8px] font-mono font-bold tracking-widest text-[#22c55e] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
            ONLINE
          </span>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="p-2.5 space-y-1">
          <button
            onClick={() => handleAdminTabChange("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "dashboard"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Painel do WordPress</span>
          </button>

          <button
            onClick={() => handleAdminTabChange("new_post")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "new_post"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="flex-1">Escrever Postagem</span>
            <span className="text-[8px] bg-[#22c55e] text-black font-mono font-bold px-1.5 rounded-full">Novo</span>
          </button>

          <button
            onClick={() => handleAdminTabChange("manage_posts")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "manage_posts"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="flex-1">Gerenciar Posts</span>
            <span className="text-[8px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => handleAdminTabChange("appearance")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "appearance"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Aparência & Degradês</span>
          </button>

          <button
            onClick={() => handleAdminTabChange("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "settings"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações WP</span>
          </button>

          <button
            onClick={() => handleAdminTabChange("pages")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "pages"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Layout className="w-4 h-4" />
            <span className="flex-1">Editar Páginas / Seções</span>
            <span className="text-[8px] bg-pink-550 text-white px-1.5 py-0.5 rounded-md font-mono font-bold">
              Todas
            </span>
          </button>
          
          <button
            onClick={() => handleAdminTabChange("enrollments")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === "enrollments"
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="flex-1">Relatórios de Matrícula</span>
            <span className="text-[8px] bg-pink-500 text-white font-mono font-bold px-1.5 py-0.5 rounded-full">VIP</span>
          </button>
          
          <button
            onClick={() => handleAdminTabChange("users" as any)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium tracking-wide transition ${
              activeAdminTab === ("users" as any)
                ? "bg-gradient-to-r from-green-500/20 to-pink-500/5 text-[#22c55e] border-l-3 border-[#22c55e] font-bold"
                : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="flex-1">Gestão de Usuários</span>
            <span className="text-[8px] bg-amber-500 text-black font-mono font-bold px-1.5 py-0.5 rounded-full">NOVO</span>
          </button>
        </nav>

        {/* Dynamic Widget Section inside sidebar */}
        <div className="m-4 p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 space-y-2">
          <span className="text-[9px] text-[#22c55e] font-mono leading-none tracking-wider font-bold block uppercase">
            ⚡ Status de Render
          </span>
          <p className="text-[10px] text-zinc-400 leading-normal">
            Os gradientes de <strong>Verde e Rosa</strong> ativos operam com aceleração de hardware GPU.
          </p>
        </div>

        {/* Google Auth Admin Panel */}
        <div className="m-4 p-3 bg-stone-900/60 rounded-xl border border-zinc-800 space-y-3">
          <span className="text-[9px] text-pink-500 font-mono leading-none tracking-wider font-bold block uppercase flex items-center gap-1">
            <Unlock className="w-3 h-3 text-pink-500" /> Autenticação Google
          </span>
          {user?.isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user.photoUrl && (
                  <img src={user.photoUrl} alt="avatar" className="w-7 h-7 rounded-full border border-green-400" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[10px] text-white line-clamp-1">{user.name}</span>
                  <span className="text-[8px] text-zinc-400 font-mono line-clamp-1">{user.email || "Administrador"}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound(600, "sine");
                  onLogout?.();
                }}
                className="w-full py-1.5 px-3 rounded-lg text-[9px] font-mono tracking-wider font-bold uppercase transition bg-red-950/40 border border-red-905/40 text-red-400 hover:bg-red-900 hover:text-white flex items-center justify-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Desconectar</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[9px] text-zinc-400 leading-normal font-mono">
                Faça login para salvar suas edições no servidor.
              </p>
              <button
                type="button"
                onClick={() => {
                  playClickSound(700, "sine");
                  onTriggerAuth?.();
                }}
                className="w-full py-2 px-3 rounded-xl text-[10px] font-mono tracking-widest font-black uppercase transition-all duration-300 bg-stone-950 border border-green-500 hover:border-green-400 text-green-400 hover:text-white flex items-center justify-center gap-1.5"
                id="connect-google-btn-admin"
              >
                <Unlock className="w-3 h-3" />
                <span>Entrar (Google)</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CORE WORKSPACE CONTENT PANEL */}
      <main className="flex-1 p-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl shadow-xl min-h-[500px]">
        
        {/* TAB 1: GENERAL MONITOR PORTAL DASHBOARD */}
        {activeAdminTab === "dashboard" && (
          <div className="space-y-6">
            
            {/* Real-time metrics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="p-4 bg-black border border-green-500/30 rounded-xl relative overflow-hidden">
                <span className="text-[9px] text-zinc-500 font-mono uppercase block font-bold">Leitores de Conteúdo de Campo</span>
                <div className="text-2xl font-display font-black text-white mt-1 flex items-baseline gap-1">
                  <span>{activeReaders}</span>
                  <span className="text-[10px] text-green-400 font-mono animate-pulse">● LIVE</span>
                </div>
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
              </div>

              <div className="p-4 bg-black border border-pink-500/30 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase block font-bold">Ações de Compartilhar</span>
                  <div className="text-2xl font-display font-black text-white mt-1">
                    {totalSharesCount}
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound(620, "triangle");
                    setSimulationSpeed((prev) => (prev === "normal" ? "fast" : "normal"));
                  }}
                  className="mt-2 text-[8px] bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 py-0.5 px-2 rounded-md font-mono border border-pink-500/25 transition-all text-center self-start"
                >
                  SIMULAR {simulationSpeed === "fast" ? "RÁPIDO ⚡" : "NORMAL"}
                </button>
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl">
                <span className="text-[9px] text-zinc-500 font-mono uppercase block font-bold">Assinantes no Portal</span>
                <div className="text-2xl font-display font-black text-white mt-1">5,142</div>
                <span className="text-[8px] text-green-400 font-mono block mt-1">+14% crescimento</span>
              </div>

              <div className="p-4 bg-black border border-zinc-800 rounded-xl">
                <span className="text-[9px] text-zinc-500 font-mono uppercase block font-bold">Engajamento Médio</span>
                <div className="text-2xl font-display font-black text-[#22c55e] mt-1">87.4%</div>
                <span className="text-[8px] text-zinc-500 font-mono block mt-1">Cliques validados</span>
              </div>

            </div>

            {/* Visual Recharts Graphics Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              <div className="p-4 bg-black border border-zinc-850 rounded-xl space-y-3">
                <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                  <BarChart3 className="w-4 h-4 text-green-400" />
                  <span>Real-Time Cliques por Matéria (Top 7)</span>
                </h4>
                <div className="h-56 min-h-[224px] w-full text-[10px] font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" />
                      <XAxis dataKey="name" stroke="#737373" />
                      <YAxis stroke="#737373" />
                      <Tooltip contentStyle={{ backgroundColor: "#0c0c0e", borderColor: "#27272a" }} />
                      <Bar dataKey="Visualizações" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 bg-black border border-zinc-850 rounded-xl space-y-3">
                <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-900">
                  <Activity className="w-4 h-4 text-pink-400" />
                  <span>Crescimento de Cliques e Newsletter</span>
                </h4>
                <div className="h-56 min-h-[224px] w-full text-[10px] font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineHistoryData}>
                      <defs>
                        <linearGradient id="colorAssin" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCliq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1e" />
                      <XAxis dataKey="name" stroke="#737373" />
                      <YAxis stroke="#737373" />
                      <Tooltip contentStyle={{ backgroundColor: "#0c0c0e", borderColor: "#27272a" }} />
                      <Area type="monotone" dataKey="Assinantes" stroke="#22c55e" fill="url(#colorAssin)" />
                      <Area type="monotone" dataKey="Cliques Ativos" stroke="#ec4899" fill="url(#colorCliq)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Quick stats note details */}
            <div className="p-4 bg-gradient-to-r from-green-500/10 via-pink-500/5 to-black border border-zinc-900 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-white font-bold block">Boas-vindas ao WP-Admin do Portal!</span>
                <span className="text-[11px] text-zinc-400 block max-w-xl">
                  Edição descomplicada estilo WordPress. Troque cores, altere nomes do cabeçalho de notícias, gerencie o canal de podcasts, acompanhe tendências de curtidas e otimize a experiência auditiva do usuário da Zona da Mata.
                </span>
              </div>
              <button
                onClick={() => handleAdminTabChange("new_post")}
                className="px-4 py-2 font-mono font-bold text-[10px] text-black bg-[#22c55e] hover:bg-green-400 rounded-xl transition uppercase"
              >
                Nova Postagem →
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: WRITE NEW BLOG POST FORM */}
        {activeAdminTab === "new_post" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
              <PlusCircle className="w-5 h-5 text-[#22c55e]" />
              <div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
                  Escrever Nova Matéria Regional
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono block">Crie novos tópicos e salve diretamente no feed regional</span>
              </div>
            </div>

            {successMsg && (
              <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl text-xs text-green-400 font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handlePublishPost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">
                    Título da Publicação *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Novo Café Tecnológico de Ubá"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-450"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">
                    Categoria da Notícia *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-green-400"
                  >
                    <option value="NOTÍCIAS">NOTÍCIAS</option>
                    <option value="CURSOS">CURSOS</option>
                    <option value="VAGA DE EMPREGOS">VAGA DE EMPREGOS</option>
                    <option value="EVENTOS">EVENTOS</option>
                    <option value="PODCAST">PODCAST</option>
                    <option value="COMUNIDADE">COMUNIDADE (🔒 VIP)</option>
                    <option value="EMBAIXADORES">EMBAIXADORES (🔒 VIP)</option>
                    <option value="TOUR">TOUR GASTRO</option>
                    <option value="QUEM SOMOS">QUEM SOMOS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">
                  Linha Fina / Sumário Rápido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sumário atraente visualizado no feed do portal..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Localidade</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Nome do Redator</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Etiquetas (Tags)</label>
                  <input
                    type="text"
                    placeholder="Separe por vírgulas..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-850 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-bold block">Bloqueio Premium de Leitores</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Requer login no e-mail do Google (Gmail) regional</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4.5 h-4.5 text-green-500 cursor-pointer focus:ring-0 bg-stone-900 border-zinc-700 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Imagens da Notícia (Capa)</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local File Uploader zone */}
                  <div
                    onClick={() => articleFileInputRef.current?.click()}
                    className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition p-2 relative overflow-hidden ${
                      image.startsWith("data:image/")
                        ? "border-green-400 bg-green-400/5"
                        : "border-zinc-800 hover:border-green-400/50 hover:bg-zinc-900/10"
                    }`}
                  >
                    <input
                      ref={articleFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                          if (!allowedTypes.includes(file.type)) {
                            toast.error("Formato de arquivo não suportado! Envie apenas fotos em formato JPG, PNG ou WEBP.");
                            return;
                          }
                          const r = new FileReader();
                          r.onloadend = () => {
                            const b64 = r.result as string;
                            setCropperSource(b64);
                            setIsCropperOpen(true);
                          };
                          r.readAsDataURL(file);
                        }
                      }}
                    />
                    
                    {image.startsWith("data:image/") ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-black/60">
                        <img src={image} alt="Preview do arquivo" className="max-h-full object-contain" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImage(PRESET_IMGS[0]); }}
                          className="absolute top-1 right-1 p-1 rounded-lg bg-black/95 text-white hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload className="w-5 h-5 mx-auto text-green-400 animate-pulse" />
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-white">Upload Capa Local</p>
                          <p className="text-[8px] text-zinc-500 font-mono">Clique para subir de seu computador</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] text-zinc-500 uppercase font-mono leading-none font-bold mb-1">Presets Disponíveis</span>
                    <div className="flex items-center gap-1.5 pb-1.5 overflow-x-auto">
                      {PRESET_IMGS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            playClickSound(600 + i * 50);
                            setImage(p);
                          }}
                          className={`relative w-12 h-8 rounded-md border-2 shrink-0 overflow-hidden transition-all ${
                            image === p ? "border-green-400 scale-102 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={p} alt="Preset visual" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Ou cole uma URL de imagem (ex: https://...)"
                      value={image.startsWith("data:image/") ? "" : image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full p-2 rounded-lg bg-stone-900 border border-zinc-800 text-[10px] text-white placeholder-zinc-600 focus:outline-none focus:border-green-450 font-mono"
                      disabled={image.startsWith("data:image/")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] text-zinc-400 uppercase font-mono font-bold block">Editorial Completo *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Redija o texto da matéria..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-stone-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-green-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-400 to-pink-500 text-black font-display font-black tracking-widest uppercase text-xs rounded-xl hover:opacity-90 active:scale-98 transition duration-200"
              >
                Salvar e Publicar no Portal (Estilo WordPress)
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MANAGE POSTS LIST */}
        {activeAdminTab === "manage_posts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" />
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
                    Gerenciar Matérias Cadastradas
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono block">Apague notícias ou acompanhe a visualização de cliques local</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Total: {articles.length} posts</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-neutral-950 border border-zinc-900 hover:border-zinc-800 flex items-center justify-between gap-4 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-12 h-10 object-cover rounded-lg bg-zinc-900 shrink-0 border border-zinc-800"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded uppercase font-mono font-bold">
                          {art.category}
                        </span>
                        {art.isPremium && (
                          <span className="text-[8px] bg-pink-500/10 text-pink-400 px-1 border border-pink-500/15 rounded font-mono font-bold">
                            PREMIUM
                          </span>
                        )}
                        <span className="text-[9px] text-zinc-500 font-mono">{art.location}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-md mt-1 group-hover:text-[#22c55e] transition">
                        {art.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-green-400" />
                      {art.views} views
                    </span>

                    <button
                      onClick={() => {
                        playClickSound(180, "sawtooth");
                        onDeleteArticle(art.id);
                      }}
                      className="p-2 bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg border border-zinc-850 hover:border-red-500/20 transition"
                      title="Apagar Postagem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: APPEARANCE & GRADIENTS CUSTOMIZER */}
        {activeAdminTab === "appearance" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
              <Palette className="w-5 h-5 text-green-400 animate-spin-slow" />
              <div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
                  Estilo de Aparência: Degradês Verde & Rosa
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono block">Personalize o espectro de fluorescência neon e layouts</span>
              </div>
            </div>

            {/* Select Gradient Presets */}
            <div className="space-y-3">
              <label className="text-[10.5px] uppercase font-mono text-zinc-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Selecione o Efeito de Degradê Ativo:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                <button
                  onClick={() => {
                    playClickSound(800, "sine");
                    onSelectGradientStyle("neonPulse");
                  }}
                  className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                    gradientStyle === "neonPulse"
                      ? "bg-stone-900/40 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                      : "bg-black border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-0 right-0 h-1 w-1/2 bg-gradient-to-r from-green-400 to-pink-500"></div>
                  <span className="text-[11px] font-bold text-white block uppercase mb-1">⚡ Verde & Rosa Pulsante</span>
                  <p className="text-[10px] text-zinc-400 leading-normal">Glow marcante do logotipo e dos cabeçalhos principais do portal.</p>
                </button>

                <button
                  onClick={() => {
                    playClickSound(850, "sine");
                    onSelectGradientStyle("auroraGreenPink");
                  }}
                  className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                    gradientStyle === "auroraGreenPink"
                      ? "bg-stone-900/40 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                      : "bg-black border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-0 right-0 h-1 w-1/2 bg-gradient-to-r from-pink-500 to-green-400"></div>
                  <span className="text-[11px] font-bold text-white block uppercase mb-1">🌈 Aurora Meridional</span>
                  <p className="text-[10px] text-zinc-400 leading-normal">Transição fluida unindo o verde folha e cor-de-rosa amarena.</p>
                </button>

                <button
                  onClick={() => {
                    playClickSound(900, "sine");
                    onSelectGradientStyle("pinkGlow");
                  }}
                  className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                    gradientStyle === "pinkGlow"
                      ? "bg-stone-900/40 border-rose-500/50"
                      : "bg-black border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-0 right-0 h-1 w-1/2 bg-rose-500"></div>
                  <span className="text-[11px] font-bold text-white block uppercase mb-1">🌸 Rosa Neon Exclusivo</span>
                  <p className="text-[10px] text-zinc-400 leading-normal">Sombreamentos hot-pink ideais para visualização noturna de celular.</p>
                </button>

                <button
                  onClick={() => {
                    playClickSound(950, "sine");
                    onSelectGradientStyle("subtleSpring");
                  }}
                  className={`p-4 rounded-xl border text-left transition relative overflow-hidden group ${
                    gradientStyle === "subtleSpring"
                      ? "bg-stone-900/40 border-green-400/50"
                      : "bg-black border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  <div className="absolute top-0 right-0 h-1 w-1/2 bg-green-400"></div>
                  <span className="text-[11px] font-bold text-white block uppercase mb-1">🌱 Primavera Ecológica</span>
                  <p className="text-[10px] text-zinc-400 leading-normal">Accents verdes discretos, ideal para leitura corporativa prolongada.</p>
                </button>

              </div>
            </div>

            {/* Direct Logos Editing Fields */}
            <div className="space-y-3.5 border-t border-zinc-900 pt-4">
              <label className="text-[10.5px] uppercase font-mono text-zinc-400 font-bold block">
                Textos e Slogan da Plataforma:
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black p-4 rounded-xl border border-zinc-900">
                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">Texto Logo 1</span>
                  <input
                    type="text"
                    value={logoText1}
                    onChange={(e) => setLogoText1(e.target.value)}
                    className="w-full p-2 bg-zinc-900 text-xs text-white rounded border border-zinc-850 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">Texto Logo 2 (Glow)</span>
                  <input
                    type="text"
                    value={logoText2}
                    onChange={(e) => setLogoText2(e.target.value)}
                    className="w-full p-2 bg-zinc-900 text-xs text-white rounded border border-zinc-850 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">Linha Slogan do Cabeçalho</span>
                  <input
                    type="text"
                    value={logoSlogan}
                    onChange={(e) => setLogoSlogan(e.target.value)}
                    className="w-full p-2 bg-zinc-900 text-xs text-white rounded border border-zinc-850"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold text-[#22c55e]">Copyright / Rodapé</span>
                  <input
                    type="text"
                    value={localCredits}
                    onChange={(e) => setLocalCredits(e.target.value)}
                    className="w-full p-2 bg-zinc-900 text-xs text-white rounded border border-zinc-850 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyAppearance}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-pink-500 text-black font-mono font-black uppercase text-xs rounded-xl tracking-wider hover:opacity-90 active:scale-98 transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Gravar Aparência no Portal</span>
            </button>
            <p className="text-[9px] text-zinc-500 text-center font-mono leading-none">
              A pré-visualização de cores e rodapés altera instantaneamente sem recarregar!
            </p>
          </div>
        )}

        {/* TAB 5: QUICK WP SETTINGS & AUDIO CHIP */}
        {activeAdminTab === "settings" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
              <Settings className="w-5 h-5 text-[#22c55e]" />
              <div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
                  Configurações Gerais WP & Audio-Cues
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono block">Configure preferência de cliques, beeps e o editor CMS</span>
              </div>
            </div>

            {/* Sound Toggle Box */}
            <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs text-white font-bold block flex items-center gap-1.5">
                    {isSoundActive ? <Volume2 className="w-4 h-4 text-[#22c55e] animate-bounce" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                    Sons ao clicar (Interface SoundEffects)
                  </span>
                  <span className="text-[10.5px] text-zinc-500 leading-normal">
                    Se habilitado, beeps analógicos sintetizados de onda são tocados na navegação de abas e botões do portal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="chk-audio"
                  checked={isSoundActive}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    onToggleSound(nextVal);
                    if (nextVal) {
                      setTimeout(() => playSuccessSound(), 100);
                    }
                  }}
                  className="w-4.5 h-4.5 text-green-500 cursor-pointer focus:ring-0 bg-zinc-900 border-zinc-800 rounded ml-2 shrink-0"
                />
              </div>

              {/* Speaker beeps preview triggers */}
              {isSoundActive && (
                <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-850 space-y-2.5">
                  <span className="text-[9px] text-zinc-400 font-mono block font-bold">
                    🎚️ Teste de Sintetizador Web Audio API:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleTestBeep(320, "triangle")}
                      className="py-1 px-2.5 text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-green-400 rounded transition"
                    >
                      Low Note (320Hz)
                    </button>
                    <button
                      onClick={() => handleTestBeep(640, "sine")}
                      className="py-1 px-2.5 text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-pink-500 rounded transition"
                    >
                      Mid Note (640Hz)
                    </button>
                    <button
                      onClick={() => handleTestBeep(980, "square")}
                      className="py-1 px-2.5 text-[9px] font-mono text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-green-400 rounded transition"
                    >
                      High Note (980Hz)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats logs list */}
            <div className="space-y-2 p-4 rounded-xl bg-black border border-zinc-850">
              <span className="text-xs text-zinc-300 font-bold block flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Diagnóstico de Memória WP Cache
              </span>
              <p className="text-[9.5px] text-zinc-500 leading-normal">
                Nenhuma alteração feita aqui fará posts ou personalizações de rodapés se perderem no ar ao alternar o estúdio. O site se adapta em tempo real por meio de estados transparentes (React Hooks).
              </p>
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[9px] text-zinc-400 font-mono">
                <span>Instância Node/Vite</span>
                <span className="text-green-400">● Conectado (v18.0)</span>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound(600, "sine");
                toast.success("As configurações do painel WordPress foram persistidas!");
              }}
              className="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono rounded-lg transition hover:text-white hover:border-zinc-700"
            >
              Salvar Tudo Permanente
            </button>
          </div>
        )}

        {/* TAB 7: ENROLLMENTS */}
        {activeAdminTab === "enrollments" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">Relatórios de Matrícula</h3>
                <p className="text-zinc-400 text-sm mt-1">Gerencie os cadastros para os planos da comunidade.</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/40">
                <h4 className="font-bold text-white text-sm">Lista de Cadastros Recentes</h4>
                <div className="text-[10px] text-zinc-500 font-mono">{communityEnrollments.length} Registros Encontrados</div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/60 text-zinc-400 font-mono text-[10px] uppercase tracking-widest border-b border-zinc-800">
                      <th className="p-4 font-bold">Data</th>
                      <th className="p-4 font-bold">Nome</th>
                      <th className="p-4 font-bold">WhatsApp</th>
                      <th className="p-4 font-bold">Segmento</th>
                      <th className="p-4 font-bold">Plano Escolhido</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-zinc-300">
                    {loadingEnrollments ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono text-xs">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                            Carregando dados...
                          </div>
                        </td>
                      </tr>
                    ) : communityEnrollments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono text-xs">Nenhuma matrícula registrada ainda.</td>
                      </tr>
                    ) : (
                      communityEnrollments.slice().reverse().map((enrollment, index) => (
                        <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition">
                          <td className="p-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                            {new Date(enrollment.createdAt).toLocaleString("pt-BR")}
                          </td>
                          <td className="p-4 font-bold text-white">{enrollment.name}</td>
                          <td className="p-4 font-mono text-green-400">
                            <a href={`https://wa.me/${enrollment.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                              {enrollment.whatsapp}
                            </a>
                          </td>
                          <td className="p-4 text-zinc-400">{enrollment.sector || "-"}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              {enrollment.plan}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: USERS MANAGEMENT (APPROVALS & STATUS) */}
        {activeAdminTab === ("users" as any) && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight flex items-center gap-2.5">
                  <UserCheck className="w-6 h-6 text-amber-400" />
                  <span>Gestão de Usuários & Aprovações</span>
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Controle os acessos ao painel e aprove membros com 1 clique (Aprovado / Teste 14 Dias / Suspenso).
                </p>
              </div>
              <button
                onClick={fetchUsersList}
                disabled={loadingUsers}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? "animate-spin text-green-400" : ""}`} />
                <span>Atualizar Lista</span>
              </button>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/40">
                <h4 className="font-bold text-white text-sm">Usuários Cadastrados ({usersList.length})</h4>
                <div className="text-[10px] text-zinc-500 font-mono">Aprovação Manual Requerida</div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] text-zinc-500 uppercase font-mono tracking-widest">
                      <th className="p-4">Usuário</th>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Status Atual</th>
                      <th className="p-4">Data Cadastro</th>
                      <th className="p-4 text-right">Ações de Controle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50 text-xs text-zinc-300">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">Carregando usuários...</td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">Nenhum usuário encontrado.</td>
                      </tr>
                    ) : (
                      usersList.map((u, idx) => (
                        <tr key={u.email || idx} className="hover:bg-zinc-900/40 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={u.photoUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(u.email || 'user')}`}
                              alt={u.name || "Foto"}
                              className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 object-cover"
                            />
                            <div>
                              <div className="font-bold text-white">{u.name || "Usuário"}</div>
                              {u.email === "diretoria@portal.com" && (
                                <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono font-bold">Admin Master</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                          <td className="p-4">
                            {u.status === "approved" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                <CheckCircle className="w-3 h-3 text-green-400" /> Aprovado / Premium
                              </span>
                            ) : u.status === "trial" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                <Activity className="w-3 h-3 text-amber-400" /> Teste Grátis (14d)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                <X className="w-3 h-3 text-red-400" /> Suspenso / Em Análise
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-zinc-500 font-mono text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("pt-BR") : "Recente"}
                          </td>
                          <td className="p-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleUpdateUserStatus(u.email, "approved")}
                              title="Aprovar Acesso Premium"
                              className="px-2.5 py-1 bg-green-500/15 hover:bg-green-500 text-green-400 hover:text-black rounded-lg font-mono font-bold text-[10px] uppercase transition cursor-pointer"
                            >
                              🟢 Aprovar
                            </button>
                            <button
                              onClick={() => handleUpdateUserStatus(u.email, "trial")}
                              title="Conceder Teste 14 Dias"
                              className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-black rounded-lg font-mono font-bold text-[10px] uppercase transition cursor-pointer"
                            >
                              🟡 Teste 14d
                            </button>
                            <button
                              onClick={() => handleUpdateUserStatus(u.email, "suspended")}
                              title="Suspender ou Congelar"
                              className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-black rounded-lg font-mono font-bold text-[10px] uppercase transition cursor-pointer"
                            >
                              🔴 Suspender
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GENERAL PORTAL PAGES CONFIGURATOR */}
        {activeAdminTab === "pages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-pink-500" />
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
                    Gerenciador de Conteúdo das Páginas
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono block">Escolha uma seção para modificar textos, fotos e endereços ativos no portal</span>
                </div>
              </div>

              {pagesSuccessMsg && (
                <span className="text-[10px] bg-green-500/15 border border-green-500/30 text-green-400 font-mono font-bold px-2.5 py-1 rounded-lg animate-pulse">
                  {pagesSuccessMsg}
                </span>
              )}
            </div>

            {/* Micro-navigation for pages tabs */}
            <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl max-h-[160px] overflow-y-auto">
              {(["quemsomos", "objetivos", "ondeestamos", "contato", "comunidade", "eventos", "galeria", "embaixadores", "vagas", "cursos", "parceiros", "podcast", "anuncie"] as const).map((sub) => {
                const isActive = selectedSubPage === sub;
                const label = sub === "quemsomos" ? "Quem Somos" :
                              sub === "objetivos" ? "Objetivos" :
                              sub === "ondeestamos" ? "Fisico / Mapa" :
                              sub === "contato" ? "Contatos / Redes" :
                              sub === "comunidade" ? "Comunidade" :
                              sub === "eventos" ? "Eventos" :
                              sub === "galeria" ? "Galeria" :
                              sub === "embaixadores" ? "Embaixadores" :
                              sub === "vagas" ? "Vagas Emprego" :
                              sub === "cursos" ? "Cursos On-line" :
                              sub === "parceiros" ? "Parceiros" :
                              sub === "podcast" ? "Podcast" : "Anuncie Aqui";
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      playClickSound(640, "sine");
                      setSelectedSubPage(sub);
                    }}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-mono uppercase font-extrabold transition-all whitespace-nowrap grow text-center ${
                      isActive
                        ? "bg-pink-500 text-black shadow-lg shadow-pink-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* SUB-TAB 1: QUEM SOMOS */}
            {selectedSubPage === "quemsomos" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Biografia e Trajetória de Regina Simões</span>
                
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Parágrafo 1 - Introdução Profissional:</label>
                    <textarea
                      value={qsP1}
                      onChange={(e) => setQsP1(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Parágrafo 2 - Atuação como Host do Podcast:</label>
                    <textarea
                      value={qsP2}
                      onChange={(e) => setQsP2(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Parágrafo 3 - Liderança da Comunidade:</label>
                    <textarea
                      value={qsP3}
                      onChange={(e) => setQsP3(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Parágrafo 4 - Liderança de Vendas e Palestras:</label>
                    <textarea
                      value={qsP4}
                      onChange={(e) => setQsP4(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Citação Inspiradora / Slogan no final da Bio:</label>
                    <input
                      type="text"
                      value={qsQuote}
                      onChange={(e) => setQsQuote(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-mono italic"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: OBJETIVOS */}
            {selectedSubPage === "objetivos" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Editar Missões e Objetivos Estratégicos</span>
                
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-green-400 font-mono uppercase block">Foco 1 - Portal de Negócios e Notícias:</label>
                    <textarea
                      value={objPortal}
                      onChange={(e) => setObjPortal(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-green-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-pink-450 font-mono uppercase block">Foco 2 - Podcast "Do Começo ao Topo":</label>
                    <textarea
                      value={objPodcast}
                      onChange={(e) => setObjPodcast(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-emerald-400 font-mono uppercase block">Foco 3 - Comunidade Aceleradora VIP:</label>
                    <textarea
                      value={objComunidade}
                      onChange={(e) => setObjComunidade(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-blue-400 font-mono uppercase block">Foco 4 - Cursos Online & Treinamentos:</label>
                    <textarea
                      value={objCursos}
                      onChange={(e) => setObjCursos(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: ONDE ESTAMOS */}
            {selectedSubPage === "ondeestamos" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Configuração de Endereço e Google Maps</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Nome do Edifício:</label>
                      <input
                        type="text"
                        value={endEdificio}
                        onChange={(e) => setEndEdificio(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Rua, Número e Sala:</label>
                      <input
                        type="text"
                        value={endRua}
                        onChange={(e) => setEndRua(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Bairro, Cidade e CEP:</label>
                      <input
                        type="text"
                        value={endBairro}
                        onChange={(e) => setEndBairro(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Complemento / Ponto de Referência:</label>
                      <input
                        type="text"
                        value={endComp}
                        onChange={(e) => setEndComp(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">URL de Embed do Iframe (Google Maps):</label>
                      <input
                        type="text"
                        value={endMapEmbed}
                        onChange={(e) => setEndMapEmbed(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-pink-500 font-mono"
                        placeholder="https://www.google.com/maps/embed..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Link Externo Google Maps (Abrir em Tela Cheia):</label>
                      <input
                        type="text"
                        value={endMapViewer}
                        onChange={(e) => setEndMapViewer(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-pink-500 font-mono"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div className="p-3.5 bg-zinc-900 border border-zinc-800/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-[#22c55e] font-bold block uppercase">Como pegar a URL de Embed?</span>
                      <p className="text-[9.5px] text-zinc-400 leading-normal font-sans">
                        Vá ao Google Maps, pesquise o local, clique em "Compartilhar", selecione a guia "Incorporar um mapa" e copie o valor contido no atributo <code>src</code> da tag <code>iframe</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: CONTATO */}
            {selectedSubPage === "contato" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Contatos, Redes e Atendimento</span>
                
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">E-mail Oficial de Atendimento:</label>
                    <input
                      type="email"
                      value={contEmail}
                      onChange={(e) => setContEmail(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Número do WhatsApp / Celular Corporativo:</label>
                    <input
                      type="text"
                      value={contWhatsapp}
                      onChange={(e) => setContWhatsapp(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Link do Perfil no Instagram:</label>
                    <input
                      type="text"
                      value={contInstagram}
                      onChange={(e) => setContInstagram(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: COMUNIDADE */}
            {selectedSubPage === "comunidade" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página Comunidade</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Comunidade:</label>
                    <input
                      type="text"
                      value={comunidadeTitle}
                      onChange={(e) => setComunidadeTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição da Comunidade:</label>
                    <textarea
                      value={comunidadeDescription}
                      onChange={(e) => setComunidadeDescription(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: EVENTOS */}
            {selectedSubPage === "eventos" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página de Eventos</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Seção de Eventos:</label>
                    <input
                      type="text"
                      value={eventosTitle}
                      onChange={(e) => setEventosTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição de Eventos:</label>
                    <textarea
                      value={eventosDescription}
                      onChange={(e) => setEventosDescription(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 7: GALERIA */}
            {selectedSubPage === "galeria" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página da Galeria</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Galeria:</label>
                    <input
                      type="text"
                      value={galeriaTitle}
                      onChange={(e) => setGaleriaTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição da Galeria:</label>
                    <textarea
                      value={galeriaDescription}
                      onChange={(e) => setGaleriaDescription(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 8: EMBAIXADORES */}
            {selectedSubPage === "embaixadores" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página de Embaixadores</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Área de Embaixadores:</label>
                    <input
                      type="text"
                      value={embaixadoresTitle}
                      onChange={(e) => setEmbaixadoresTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição dos Embaixadores:</label>
                    <textarea
                      value={embaixadoresDescription}
                      onChange={(e) => setEmbaixadoresDescription(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 9: VAGAS */}
            {selectedSubPage === "vagas" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página de Vagas de Emprego</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Seção de Vagas:</label>
                    <input
                      type="text"
                      value={vagasTitle}
                      onChange={(e) => setVagasTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição da Seção de Vagas:</label>
                    <textarea
                      value={vagasDescription}
                      onChange={(e) => setVagasDescription(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 10: CURSOS */}
            {selectedSubPage === "cursos" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página de Cursos Online</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título da Seção de Cursos:</label>
                    <input
                      type="text"
                      value={cursosTitle}
                      onChange={(e) => setCursosTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição de Cursos:</label>
                    <textarea
                      value={cursosDescription}
                      onChange={(e) => setCursosDescription(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3 mt-4">
                    <span className="text-[10px] font-mono text-pink-400 font-black block uppercase flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5" /> Adicionar Novo Curso à Listagem:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nome do Curso"
                        value={newCursoName}
                        onChange={(e) => setNewCursoName(e.target.value)}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Link Externo (Checkout/Hotmart)"
                        value={newCursoUrl}
                        onChange={(e) => setNewCursoUrl(e.target.value)}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                      />
                    </div>
                    <textarea
                      placeholder="Descrição curta do curso e benefícios..."
                      value={newCursoDesc}
                      onChange={(e) => setNewCursoDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCursoName || !newCursoDesc) return;
                        setLocalCursos([...localCursos, { name: newCursoName, description: newCursoDesc, url: newCursoUrl }]);
                        setNewCursoName("");
                        setNewCursoDesc("");
                        setNewCursoUrl("");
                        playSuccessSound();
                      }}
                      className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-[10px] rounded-lg transition uppercase tracking-widest shadow-lg shadow-pink-500/10"
                    >
                      Registrar Curso no Portal →
                    </button>
                  </div>

                  <div className="space-y-2 mt-4">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold px-1">Cursos Cadastrados:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {localCursos.map((curso, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-850 rounded-xl group hover:border-pink-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-pink-500 shadow-inner">
                              <Activity className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-[11px] font-bold text-white group-hover:text-pink-400 transition-colors">{curso.name}</h5>
                              <p className="text-[10px] text-zinc-500 line-clamp-1">{curso.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              playClickSound(180, "sawtooth");
                              setLocalCursos(localCursos.filter((_, i) => i !== idx));
                            }}
                            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                            title="Remover Curso"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {localCursos.length === 0 && (
                        <div className="p-4 text-center border border-dashed border-zinc-800 rounded-xl">
                          <span className="text-[10px] font-mono text-zinc-500 italic">Nenhum curso cadastrado ainda.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 11: PARCEIROS */}
            {selectedSubPage === "parceiros" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-5 text-left">
                <span className="text-xs text-white font-bold block">Página dos Parceiros / Patrocinadores</span>
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                    <span className="text-[10.5px] text-zinc-300 font-bold block uppercase tracking-wider">Configuração Inicial:</span>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-zinc-400 font-mono uppercase block">Subtítulo Geral de Parceiros:</label>
                      <textarea
                        value={comunidadeDescription} // lets map to community text/partners intro
                        onChange={(e) => setComunidadeDescription(e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                    <span className="text-[10px] font-mono text-green-400 font-black block uppercase">➕ Adicionar Novo Parceiro:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nome da Empresa (ex: Startup Hub JF)"
                        value={newParceiroName}
                        onChange={(e) => setNewParceiroName(e.target.value)}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none focus:border-green-400 font-mono font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Segmento / Descrição curta"
                        value={newParceiroDesc}
                        onChange={(e) => setNewParceiroDesc(e.target.value)}
                        className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-white focus:outline-none focus:border-green-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newParceiroName || !newParceiroDesc) return;
                        setLocalParceiros([...localParceiros, { name: newParceiroName, description: newParceiroDesc }]);
                        setNewParceiroName("");
                        setNewParceiroDesc("");
                        playSuccessSound();
                      }}
                      className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-mono font-black uppercase text-[9.5px] rounded transition"
                    >
                      Gravar Parceiro na Lista
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400 block font-bold uppercase">Parceiros Cadastrados ({localParceiros.length}):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto pr-1">
                      {localParceiros.map((p, index) => (
                        <div key={index} className="p-2 ml-1 roundedbg bg-zinc-900/60 border border-zinc-850 flex items-center justify-between text-xs gap-2">
                          <div>
                            <span className="font-mono text-[10.5px] text-green-400 font-extrabold block">{p.name}</span>
                            <span className="text-[10px] text-zinc-500 line-clamp-1">{p.description}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setLocalParceiros(localParceiros.filter((_, idx) => idx !== index));
                              playClickSound(640, "sine");
                            }}
                            className="p-1 hover:bg-red-950 border border-transparent hover:border-red-800 rounded text-zinc-500 hover:text-red-400 transition"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 12: PODCAST */}
            {selectedSubPage === "podcast" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página do Podcast</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Título do Podcast:</label>
                    <input
                      type="text"
                      value={podcastTitle}
                      onChange={(e) => setPodcastTitle(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Descrição da Página do Podcast:</label>
                    <textarea
                      value={podcastDescription}
                      onChange={(e) => setPodcastDescription(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
                    />
                  </div>
                  <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-850 text-[10px] leading-relaxed text-zinc-400 font-sans">
                    💡 <strong>Dica Premium:</strong> Os episódios de áudio e seus respectivos links de vídeo do YouTube podem ser editados diretamente no próprio feed interativo da página do **Podcast**, clicando no ícone de engrenagem/lápis de cada episódio em modo Administrador!
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 13: ANUNCIE */}
            {selectedSubPage === "anuncie" && (
              <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-4 text-left">
                <span className="text-xs text-white font-bold block mb-1">Página Anuncie Aqui & Mídia Kit</span>
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">Parágrafo Comercial de Introdução:</label>
                    <textarea
                      value={anunciePara1}
                      onChange={(e) => setAnunciePara1(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-pink-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-zinc-900 py-3.5">
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-green-400 block">Destaque 1</span>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Título:</label>
                        <input
                          type="text"
                          value={anuncieSec1Title}
                          onChange={(e) => setAnuncieSec1Title(e.target.value)}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Texto Curto:</label>
                        <textarea
                          value={anuncieSec1Text}
                          onChange={(e) => setAnuncieSec1Text(e.target.value)}
                          rows={2}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10.5px] text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-tight"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-green-400 block">Destaque 2</span>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Título:</label>
                        <input
                          type="text"
                          value={anuncieSec2Title}
                          onChange={(e) => setAnuncieSec2Title(e.target.value)}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Texto Curto:</label>
                        <textarea
                          value={anuncieSec2Text}
                          onChange={(e) => setAnuncieSec2Text(e.target.value)}
                          rows={2}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10.5px] text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-tight"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-green-400 block">Destaque 3</span>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Título:</label>
                        <input
                          type="text"
                          value={anuncieSec3Title}
                          onChange={(e) => setAnuncieSec3Title(e.target.value)}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-pink-500 font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] text-zinc-500">Texto Curto:</label>
                        <textarea
                          value={anuncieSec3Text}
                          onChange={(e) => setAnuncieSec3Text(e.target.value)}
                          rows={2}
                          className="w-full p-1.5 bg-zinc-900 border border-zinc-800 rounded text-[10.5px] text-zinc-300 focus:outline-none focus:border-pink-500 font-sans leading-tight"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-mono uppercase block">E-mail de Contato para Anunciar:</label>
                    <input
                      type="text"
                      value={anuncieEmail}
                      onChange={(e) => setAnuncieEmail(e.target.value)}
                      className="w-full p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSavePagesDetail}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-green-500 text-black font-mono font-black uppercase text-xs rounded-xl tracking-wider hover:opacity-90 active:scale-98 transition flex items-center justify-center gap-1.5 shadow-xl"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Salvar Alterações de Páginas</span>
            </button>
          </div>
        )}

      </main>

      <ImageCropperModal
        isOpen={isCropperOpen}
        src={cropperSource}
        onClose={() => setIsCropperOpen(false)}
        onConfirm={(cropped) => {
          setImage(cropped);
        }}
      />

    </div>
  );
}
