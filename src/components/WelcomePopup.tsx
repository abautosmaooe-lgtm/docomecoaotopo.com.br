import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronDown, 
  Sparkles, 
  UserPlus, 
  User, 
  Users, 
  Shield, 
  Handshake, 
  Megaphone, 
  Lock, 
  ArrowRight,
  Sparkle
} from "lucide-react";
import { playClickSound, playSuccessSound } from "../utils/audio";

interface WelcomePopupProps {
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

export default function WelcomePopup({ onClose, onSelectOption }: WelcomePopupProps) {
  const [isCascadeOpen, setIsCascadeOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const options = [
    { 
      label: "CADASTRE-SE", 
      desc: "Crie sua conta e participe do ecossistema",
      icon: UserPlus, 
      action: "CADASTRE-SE",
      color: "#22c55e",
      tag: "NOVO",
      badgeColor: "bg-green-500/15 text-green-400 border-green-500/30"
    },
    { 
      label: "SOU VISITANTE", 
      desc: "Navegue pelo portal e leia as notícias",
      icon: User, 
      action: "VISITANTE",
      color: "#22c55e",
      tag: "LEITOR",
      badgeColor: "bg-green-500/15 text-green-400 border-green-500/30"
    },
    { 
      label: "SOU DA COMUNIDADE", 
      desc: "Rede exclusiva de empreendedores e membros",
      icon: Users, 
      action: "COMUNIDADE",
      color: "#22c55e",
      tag: "MEMBRO",
      badgeColor: "bg-green-500/15 text-green-400 border-green-500/30"
    },
    { 
      label: "SOU EMBAIXADOR", 
      desc: "Painel de líderes e mentores regionais",
      icon: Shield, 
      action: "EMBAIXADORES",
      color: "#22c55e",
      tag: "LÍDER",
      badgeColor: "bg-green-500/15 text-green-400 border-green-500/30"
    },
    { 
      label: "SOU PARCEIRO", 
      desc: "Empresas e marcas parceiras oficiais",
      icon: Handshake, 
      action: "PARCEIROS",
      color: "#ec4899",
      tag: "PARCEIRO",
      badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30"
    },
    { 
      label: "QUERO ANUNCIAR", 
      desc: "Divulgue sua marca para milhares de líderes",
      icon: Megaphone, 
      action: "ANUNCIAR",
      color: "#ec4899",
      tag: "ANÚNCIOS",
      badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30"
    },
    { 
      label: "ADMIN", 
      desc: "Painel de gestão, moderação e controle",
      icon: Lock, 
      action: "ADMIN",
      color: "#a855f7",
      tag: "RESTRITO",
      badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30"
    },
  ];

  const handleSelect = (action: string) => {
    playSuccessSound();
    onSelectOption(action);
  };

  return (
    <div 
      id="welcome-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClickSound(500, "sine");
          onClose();
        }
      }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-green-500/15 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-pink-500/15 rounded-full filter blur-[100px]" />
      </div>

      {/* Symmetric Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative overflow-hidden p-[2px] rounded-[28px] max-w-md w-full my-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.95),0_0_40px_rgba(34,197,94,0.15)]"
      >
        {/* Animated Neon Border */}
        <motion.div
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_20%,#22c55e_38%,#ec4899_50%,#a855f7_65%,#22c55e_78%,transparent_88%)] opacity-90"
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 8, repeat: Infinity }}
        />

        {/* Inner Content Window */}
        <div className="relative bg-[#0b0c10] rounded-[26px] p-5 sm:p-6 text-center select-none z-10 flex flex-col gap-4 border border-zinc-800/80">
          
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-[26px]" />

          {/* Top Bar with Badge and Close Button */}
          <div className="relative flex items-center justify-between z-20 pb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-green-500/30 text-green-400 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>DO COMEÇO AO TOPO</span>
            </div>

            <button
              id="welcome-modal-close-btn"
              onClick={() => {
                playClickSound(500, "sine");
                onClose();
              }}
              title="Fechar e navegar (Esc)"
              className="p-1.5 rounded-full text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title and Subtitle */}
          <div className="flex flex-col items-center gap-1 z-10">
            <h2 
              id="welcome-modal-title" 
              className="text-2xl sm:text-[26px] font-black text-white leading-tight tracking-tight uppercase font-display"
            >
              BEM-VINDO!{" "}
              <span className="text-transparent bg-gradient-to-r from-green-400 via-pink-400 to-green-400 bg-clip-text">
                ESCOLHA UMA OPÇÃO
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-mono tracking-normal max-w-xs mt-0.5">
              Abra a cascata abaixo para selecionar seu perfil
            </p>
          </div>

          {/* Main Cascade Button (Accordion Trigger) */}
          <button
            id="welcome-cascade-toggle-btn"
            onClick={() => {
              playClickSound(isCascadeOpen ? 550 : 700, "triangle");
              setIsCascadeOpen(!isCascadeOpen);
            }}
            className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-green-500/40 hover:border-green-400 transition-all duration-200 cursor-pointer shadow-sm z-10 group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 group-hover:scale-105 transition-transform">
                <Sparkle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-green-400 font-bold uppercase tracking-wider">
                  MENU EM CASCATA
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {isCascadeOpen ? "Selecione seu tipo de acesso:" : "Clique para ver todas as opções..."}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-md bg-zinc-800 text-zinc-300 group-hover:text-white transition-colors">
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-300 ${
                  isCascadeOpen ? "rotate-180" : "rotate-0"
                }`} 
              />
            </div>
          </button>

          {/* Symmetrical Cascade List */}
          <AnimatePresence>
            {isCascadeOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden flex flex-col gap-2 z-10"
              >
                {options.map((item, index) => {
                  const isHovered = hoveredIndex === index;
                  return (
                    <motion.button
                      key={item.action}
                      id={`cascade-option-${item.action.toLowerCase()}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      onMouseEnter={() => {
                        playClickSound(600 + index * 30, "triangle");
                        setHoveredIndex(index);
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleSelect(item.action)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full relative flex items-center justify-between gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl bg-zinc-950/80 border transition-all duration-200 cursor-pointer overflow-hidden group text-left ${
                        isHovered 
                          ? "border-zinc-600 bg-zinc-900/90 shadow-[0_0_15px_rgba(255,255,255,0.06)]" 
                          : "border-zinc-800/80 hover:border-zinc-700"
                      }`}
                    >
                      {/* Left: Icon + Labels */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div 
                          className="p-2 rounded-lg border shrink-0 transition-all duration-200"
                          style={{
                            backgroundColor: isHovered ? `${item.color}20` : "rgba(24, 24, 27, 0.9)",
                            borderColor: isHovered ? `${item.color}80` : "rgba(39, 39, 42, 0.8)",
                            color: item.color
                          }}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs sm:text-sm font-extrabold tracking-wider uppercase text-zinc-100 group-hover:text-white truncate">
                              {item.label}
                            </span>
                            <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border font-bold shrink-0 ${item.badgeColor}`}>
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-zinc-400 font-mono tracking-tight mt-0.5 group-hover:text-zinc-300 truncate">
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      {/* Right: Clean Arrow */}
                      <div className="shrink-0 pl-1">
                        <ArrowRight 
                          className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" 
                        />
                      </div>

                      {/* Subtle hover background highlight */}
                      {isHovered && (
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Bar */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-zinc-500 text-[10px] font-mono z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span className="hidden sm:inline">PORTAL OFICIAL</span>
              <span className="sm:hidden">PORTAL</span>
            </div>
            <button
              onClick={() => {
                playClickSound(500, "sine");
                onClose();
              }}
              className="text-zinc-400 hover:text-green-400 transition-colors uppercase underline cursor-pointer"
            >
              Continuar como visitante &rarr;
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
