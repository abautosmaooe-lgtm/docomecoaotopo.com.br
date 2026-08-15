import React, { useState, useEffect, useRef } from "react";
import { Handshake, ExternalLink, ShieldCheck, ArrowRight, Sparkles, Plus, Edit, Trash2, X, Upload, Check } from "lucide-react";
import { playClickSound, playSuccessSound } from "../utils/audio";

interface Partner {
  id: string;
  name: string;
  slogan: string;
  logoUrl: string;
  url: string;
  badge: string;
  colorTheme: "blue" | "green" | "amber" | "pink" | "sky";
  accentBorder?: string;
  shadowGlow?: string;
  badgeColor?: string;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: "partner-bahamas",
    name: "Supermercados Bahamas",
    slogan: "É Logo Aqui! Economia e qualidade todos os dias perto de você.",
    logoUrl: "https://i.ibb.co/VcJnYSjn/Logo-bahamas-e-logo-aqui-png.webp",
    url: "https://bahamas.com.br/encartes/",
    badge: "Anunciante Master",
    colorTheme: "blue"
  },
  {
    id: "partner-vol-fibra",
    name: "VOL Internet Fibra",
    slogan: "Conexão de altíssima velocidade e fibra óptica para Juiz de Fora e região.",
    logoUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80",
    url: "https://volfibra.com.br",
    badge: "Telecom & Fibra Óptica",
    colorTheme: "sky"
  },
  {
    id: "partner-aroma-sonhos",
    name: "Aroma dos Sonhos",
    slogan: "Aromas exclusivos e essências que transformam e encantam ambientes.",
    logoUrl: "https://i.ibb.co/KcpJNcgQ/Whats-App-Image-2026-08-12-at-17-44-29.jpg",
    url: "https://www.instagram.com/aromadossonhos.jf/",
    badge: "Aromaterapia & Bem-Estar",
    colorTheme: "pink"
  },
  {
    id: "partner-braz-shopping",
    name: "Braz Shopping",
    slogan: "O coração das compras, lazer e serviços no centro de Juiz de Fora.",
    logoUrl: "https://i.ibb.co/pjK0PgJk/Whats-App-Image-2026-08-12-at-17-45-21.jpg",
    url: "https://www.instagram.com/brazshopping/",
    badge: "Shopping & Negócios",
    colorTheme: "amber"
  },
  {
    id: "partner-mf-sabores",
    name: "MF Sabores",
    slogan: "Sabor, tradição e excelência gastronômica para todos os momentos.",
    logoUrl: "https://i.ibb.co/S77MGhpB/Whats-App-Image-2026-08-12-at-17-44-49.jpg",
    url: "https://www.instagram.com/mfsabores_/",
    badge: "Gastronomia & Delícias",
    colorTheme: "green"
  }
];

const getThemeClasses = (theme: string) => {
  switch (theme) {
    case "blue":
      return {
        accentBorder: "border-blue-500/50 hover:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
        shadowGlow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]",
        badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30"
      };
    case "green":
      return {
        accentBorder: "border-green-500/40 hover:border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.12)]",
        shadowGlow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.25)]",
        badgeColor: "bg-green-500/10 text-green-400 border-green-500/30"
      };
    case "amber":
      return {
        accentBorder: "border-amber-600/40 hover:border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.12)]",
        shadowGlow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
        badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30"
      };
    case "pink":
      return {
        accentBorder: "border-pink-500/40 hover:border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.12)]",
        shadowGlow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]",
        badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/30"
      };
    case "sky":
    default:
      return {
        accentBorder: "border-sky-500/40 hover:border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.12)]",
        shadowGlow: "hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]",
        badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30"
      };
  }
};

interface PartnersCarouselProps {
  isAdmin?: boolean;
}

export default function PartnersCarousel({ isAdmin = false }: PartnersCarouselProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  
  // Local form state
  const [formName, setFormName] = useState("");
  const [formSlogan, setFormSlogan] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formTheme, setFormTheme] = useState<"blue" | "green" | "amber" | "pink" | "sky">("blue");
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync / Load on mount
  useEffect(() => {
    // 1. Load from localStorage or upgrade to new curated list
    let localPartners = DEFAULT_PARTNERS;
    const saved = localStorage.getItem("partners_list");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if parsed list has the new partner IDs
          const hasNewPartners = parsed.some((p: any) => p.id === "partner-aroma-sonhos" || p.id === "partner-braz-shopping" || p.id === "partner-mf-sabores");
          if (hasNewPartners) {
            localPartners = parsed;
          } else {
            // Upgrade with new default curated list
            localPartners = DEFAULT_PARTNERS;
            localStorage.setItem("partners_list", JSON.stringify(DEFAULT_PARTNERS));
          }
        }
      } catch (e) {
        console.error("Error reading partners_list from localStorage", e);
      }
    } else {
      localStorage.setItem("partners_list", JSON.stringify(DEFAULT_PARTNERS));
    }
    setPartners(localPartners);

    // 2. Load from server
    fetch("/api/published-data")
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.partners_list) && data.partners_list.length > 0) {
          const hasNewPartners = data.partners_list.some((p: any) => p.id === "partner-aroma-sonhos" || p.id === "partner-braz-shopping" || p.id === "partner-mf-sabores");
          if (hasNewPartners) {
            setPartners(data.partners_list);
            localStorage.setItem("partners_list", JSON.stringify(data.partners_list));
          } else {
            // Update server with the new partner brands
            savePartnersList(DEFAULT_PARTNERS);
          }
        } else {
          savePartnersList(DEFAULT_PARTNERS);
        }
      })
      .catch(() => {
        savePartnersList(DEFAULT_PARTNERS);
      });

    // Add event listener for + CRIAR NOVO admin button
    const handleOpenPartnerAdd = () => {
      openAddModal();
    };
    window.addEventListener("admin_open_partner_add", handleOpenPartnerAdd);

    return () => {
      window.removeEventListener("admin_open_partner_add", handleOpenPartnerAdd);
    };
  }, []);

  // Save utility
  const savePartnersList = (newList: Partner[]) => {
    setPartners(newList);
    localStorage.setItem("partners_list", JSON.stringify(newList));
    
    // Dispatch event to sync if needed
    window.dispatchEvent(new Event("image_updated"));

    // Also attempt server-side publish-all if they want persistent updates
    fetch("/api/published-data")
      .then(res => res.json())
      .then(serverData => {
        const payload = {
          ...serverData,
          partners_list: newList
        };
        fetch("/api/publish-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(d => {
          console.log("Successfully published partners list server-side", d);
        })
        .catch(err => console.error("Error publishing partners server-side:", err));
      });
  };

  const handlePartnerClick = (partner: Partner, e: React.MouseEvent) => {
    if (isAdmin) {
      e.preventDefault();
      playClickSound(750, "sine");
      openEditModal(partner);
    } else {
      playClickSound(750, "sine");
      playSuccessSound();
    }
  };

  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setIsAddMode(false);
    setFormName(partner.name);
    setFormSlogan(partner.slogan);
    setFormBadge(partner.badge);
    setFormUrl(partner.url);
    setFormLogoUrl(partner.logoUrl);
    setFormTheme(partner.colorTheme);
    setUploadError("");
    setShowManageModal(true);
  };

  const openAddModal = () => {
    setEditingPartner(null);
    setIsAddMode(true);
    setFormName("");
    setFormSlogan("");
    setFormBadge("Apoio Especial");
    setFormUrl("");
    setFormLogoUrl("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80");
    setFormTheme("blue");
    setUploadError("");
    setShowManageModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      setUploadError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 })
        })
          .then(res => res.json())
          .then(data => {
            if (data.url) {
              setFormLogoUrl(data.url);
              playSuccessSound();
            } else {
              setUploadError("Falha ao subir imagem");
            }
          })
          .catch(err => {
            console.error(err);
            setUploadError("Erro no envio");
          })
          .finally(() => {
            setUploadingImage(false);
          });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlogan || !formLogoUrl) {
      alert("Por favor preencha todos os campos obrigatórios");
      return;
    }

    if (isAddMode) {
      const newPartner: Partner = {
        id: `partner-${Date.now()}`,
        name: formName,
        slogan: formSlogan,
        badge: formBadge,
        url: formUrl || "https://google.com",
        logoUrl: formLogoUrl,
        colorTheme: formTheme
      };
      const newList = [...partners, newPartner];
      savePartnersList(newList);
    } else if (editingPartner) {
      const newList = partners.map(p => p.id === editingPartner.id ? {
        ...p,
        name: formName,
        slogan: formSlogan,
        badge: formBadge,
        url: formUrl,
        logoUrl: formLogoUrl,
        colorTheme: formTheme
      } : p);
      savePartnersList(newList);
    }
    
    setShowManageModal(false);
    playSuccessSound();
  };

  const handleDeletePartner = (id: string) => {
    {
      const newList = partners.filter(p => p.id !== id);
      savePartnersList(newList);
      setShowManageModal(false);
      playClickSound(400, "sine");
    }
  };

  // Replicate partners list to form a continuous infinite flow
  const displayList = partners.length > 0 
    ? [...partners, ...partners, ...partners, ...partners] 
    : [...DEFAULT_PARTNERS, ...DEFAULT_PARTNERS, ...DEFAULT_PARTNERS, ...DEFAULT_PARTNERS];

  return (
    <div id="partners-carousel-root" className="partners-carousel-root max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 select-none w-full overflow-hidden">
      
      {/* SECTION TICKET HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 sm:mb-6 border-b border-zinc-900/60 font-display">
        <div className="flex items-center gap-2 min-w-0">
          <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse shrink-0" />
          <div className="text-left min-w-0">
            <h3 className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase text-white flex flex-wrap items-center gap-1.5 leading-none">
              Marcas Parceiras & Apoiadores
              <span className="text-[8px] sm:text-[9px] font-mono font-bold bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 px-1.5 py-0.5 rounded leading-none shrink-0">LOOPING INSTANTÂNEO</span>
            </h3>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono mt-0.5 truncate">Empresas locais que fomentam e apoiam a descentralização cultural no Sudeste</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => { playClickSound(600, "sine"); openAddModal(); }}
              className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-black text-[9px] sm:text-[10px] font-mono font-black uppercase rounded-lg flex items-center gap-1 hover:opacity-90 transition shadow-md shadow-pink-500/10"
              title="Adicionar Novo Parceiro"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Adicionar Parceiro</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-950/40 border border-zinc-900 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
            <span>VEICULAÇÃO CERTIFICADA</span>
          </div>
        </div>
      </div>

      {/* MARQUEE CONTINUOUS STREAM CAROUSEL */}
      <div className="relative overflow-hidden w-full bg-zinc-950/60 border border-zinc-900/80 py-3 sm:py-8 px-2 sm:px-4 rounded-xl sm:rounded-3xl shadow-2xl">
        <div className="absolute inset-y-0 left-0 w-6 sm:w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-6 sm:w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

        <div className="flex items-center w-max gap-2.5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer py-1 touch-pan-x">
          {displayList.map((partner, idx) => {
            const { accentBorder, shadowGlow, badgeColor } = getThemeClasses(partner.colorTheme);
            const isBahamas = partner.id === "partner-bahamas";
            return (
              <a
                key={`${partner.id}-${idx}`}
                href={partner.url}
                target={isAdmin ? undefined : "_blank"}
                rel="noreferrer"
                onClick={(e) => handlePartnerClick(partner, e)}
                className={`flex items-center gap-3 sm:gap-5 p-3 sm:p-5 bg-black/95 border rounded-2xl sm:rounded-3xl shrink-0 transition-all duration-300 relative ${accentBorder} ${shadowGlow} w-[300px] xs:w-[350px] sm:w-[480px] md:w-[540px] max-w-[90vw] min-h-[140px] xs:min-h-[160px] sm:min-h-[190px] group overflow-hidden`}
              >
                {/* Admin click warning overlay on hover */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-3xl border border-dashed border-pink-500 pointer-events-none z-20">
                    <span className="bg-black border border-pink-500/30 text-pink-400 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <Edit className="w-3.5 h-3.5 text-pink-400" />
                      <span>Editar Marca</span>
                    </span>
                  </div>
                )}

                {/* Large Logo Image Area */}
                <div 
                  className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0 p-2 sm:p-3.5 shadow-inner group-hover:border-zinc-700 transition-colors"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="object-contain w-full h-full max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isBahamas && (
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-600 text-white text-[7px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 font-mono font-black rounded-md uppercase tracking-wider shadow-[0_0_12px_rgba(220,38,38,0.8)] z-10 border border-red-400/40">
                      MASTER
                    </div>
                  )}
                </div>

                {/* Info Text Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 sm:gap-2 text-left overflow-hidden">
                  <div className="min-w-0">
                    <span className={`inline-block text-[8px] sm:text-[11px] font-mono uppercase font-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md leading-none tracking-wider mb-1 sm:mb-1.5 ${badgeColor}`}>
                      {partner.badge}
                    </span>
                    <h4 className="font-display font-black text-xs xs:text-sm sm:text-base md:text-lg text-zinc-100 uppercase tracking-tight truncate leading-tight group-hover:text-red-400 transition-colors">
                      {partner.name}
                    </h4>
                  </div>
                  <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-[13px] text-zinc-300 font-sans tracking-tight leading-relaxed line-clamp-3">
                    {partner.slogan}
                  </p>
                </div>

                {/* Hover Visual Pointer / Arrow */}
                <div className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:bg-red-500/15 group-hover:border-red-500/40 transition-all text-zinc-400 group-hover:text-red-400 shadow-sm">
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* FOOTER INFO LINE */}
      <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[9px] font-mono text-zinc-500 px-1">
        <span className="flex items-center gap-1 text-left">
          <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
          {isAdmin 
            ? "Modo administrativo. Toque para editar qualquer parceiro." 
            : "Toque/Passe o mouse para pausar o carrossel. Clique para abrir ofertas."}
        </span>
        <span className="uppercase text-right opacity-80">Fomento & Parcerias Estáveis</span>
      </div>

      {/* ADMIN EDIT/ADD MODAL FOR PARTNERS */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative text-left">
            <button
              onClick={() => { playClickSound(600, "sine"); setShowManageModal(false); }}
              className="absolute top-4 right-4 p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-black text-sm uppercase text-white tracking-wider flex items-center gap-2 mb-4">
              <Handshake className="w-5 h-5 text-pink-500" />
              <span>{isAddMode ? "Novo Parceiro Comercial" : "Editar Parceiro Comercial"}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Partner Name */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold block">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Supermercados Bahamas"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Slogan */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold block">Slogan / Descrição Curta *</label>
                <textarea
                  required
                  rows={2}
                  value={formSlogan}
                  onChange={(e) => setFormSlogan(e.target.value)}
                  placeholder="Ex: Economia e qualidade todos os dias perto de você."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-white focus:outline-none resize-none"
                />
              </div>

              {/* Badge */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold block">Selo / Categoria (Badge) *</label>
                <input
                  type="text"
                  required
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="Ex: Anunciante Master"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold block">Link de Destino (URL)</label>
                <input
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="Ex: https://bahamas.com.br"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Color Theme & Styles */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-bold block">Tema Cromático (Estilo)</label>
                <select
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="blue">Azul (Bahamas)</option>
                  <option value="green">Verde (Indústria)</option>
                  <option value="amber">Âmbar (Cultura)</option>
                  <option value="pink">Rosa (Agronegócio)</option>
                  <option value="sky">Céu (Tecnologia)</option>
                </select>
              </div>

              {/* Logo Area */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-bold block">Logotipo / Imagem Ilustrativa *</label>
                
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={formLogoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <input
                      type="text"
                      required
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      placeholder="URL ou carregue um arquivo"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-pink-500 rounded-xl p-2 text-white focus:outline-none text-[10px]"
                    />
                    
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-lg flex items-center gap-1.5 transition text-[10px]"
                      >
                        <Upload className="w-3 h-3 text-pink-500" />
                        <span>{uploadingImage ? "Subindo..." : "Escolher arquivo"}</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </div>
                {uploadError && <p className="text-red-500 text-[10px]">{uploadError}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-zinc-900 mt-4">
                {!isAddMode && editingPartner && (
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(editingPartner.id)}
                    className="px-3 py-2 bg-red-950/60 hover:bg-red-950 border border-red-500/20 text-red-450 hover:text-red-400 rounded-xl transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover Parceiro</span>
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => { playClickSound(600, "sine"); setShowManageModal(false); }}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-black font-black uppercase rounded-xl hover:opacity-90 transition flex items-center gap-1 shadow-lg shadow-pink-500/10"
                  >
                    <Check className="w-4 h-4" />
                    <span>Salvar</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
