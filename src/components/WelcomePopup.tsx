import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Users, Shield, Handshake, Megaphone, Lock, Sparkles, Cpu, UserPlus } from "lucide-react";
import { playClickSound, playSuccessSound } from "../utils/audio";

interface WelcomePopupProps {
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

export default function WelcomePopup({ onClose, onSelectOption }: WelcomePopupProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const options = [
    { 
      label: "CADASTRE-SE", 
      icon: UserPlus, 
      action: "CADASTRE-SE",
      glowColor: "rgba(34, 197, 94, 0.8)", // Emerald/Green
      accentClass: "text-green-400 border-green-500/30 hover:border-green-400 group-hover:text-green-300",
      bgSlide: "from-green-500/10 to-transparent"
    },
    { 
      label: "SOU VISITANTE", 
      icon: User, 
      action: "VISITANTE",
      glowColor: "rgba(34, 197, 94, 0.6)", // Emerald/Green
      accentClass: "text-green-400 border-green-500/30 hover:border-green-400 group-hover:text-green-300",
      bgSlide: "from-green-500/10 to-transparent"
    },
    { 
      label: "SOU DA COMUNIDADE", 
      icon: Users, 
      action: "COMUNIDADE",
      glowColor: "rgba(34, 197, 94, 0.6)", // Emerald/Green
      accentClass: "text-green-400 border-green-500/30 hover:border-green-400 group-hover:text-green-300",
      bgSlide: "from-green-500/10 to-transparent"
    },
    { 
      label: "SOU EMBAIXADOR", 
      icon: Shield, 
      action: "EMBAIXADORES",
      glowColor: "rgba(34, 197, 94, 0.6)", // Emerald/Green
      accentClass: "text-green-400 border-green-500/30 hover:border-green-400 group-hover:text-green-300",
      bgSlide: "from-green-500/10 to-transparent"
    },
    { 
      label: "SOU PARCEIRO", 
      icon: Handshake, 
      action: "PARCEIROS",
      glowColor: "rgba(236, 72, 153, 0.6)", // Pink/Rose
      accentClass: "text-pink-400 border-pink-500/30 hover:border-pink-400 group-hover:text-pink-300",
      bgSlide: "from-pink-500/10 to-transparent"
    },
    { 
      label: "QUERO ANUNCIAR", 
      icon: Megaphone, 
      action: "ANUNCIAR",
      glowColor: "rgba(236, 72, 153, 0.6)", // Pink/Rose
      accentClass: "text-pink-400 border-pink-500/30 hover:border-pink-400 group-hover:text-pink-300",
      bgSlide: "from-pink-500/10 to-transparent"
    },
    { 
      label: "ADMIN", 
      icon: Lock, 
      action: "ADMIN",
      glowColor: "rgba(168, 85, 247, 0.6)", // Purple
      accentClass: "text-purple-400 border-purple-500/30 hover:border-purple-400 group-hover:text-purple-300",
      bgSlide: "from-purple-500/10 to-transparent"
    },
  ];

  const handleSelect = (action: string) => {
    playSuccessSound();
    onSelectOption(action);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Dynamic particles background behind the modal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-green-500/10 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Futuristic glowing modal container with active Border Beam */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative overflow-hidden p-[2.5px] rounded-[32px] max-w-md w-full shadow-[0_24px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(34,197,94,0.15)]"
      >
        {/* Neon laser continuous line loop that animates infinitely */}
        <motion.div
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_30%,#22c55e_42%,#ec4899_50%,#a855f7_58%,#22c55e_66%,transparent_75%)] opacity-100"
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 5, repeat: Infinity }}
        />

        {/* Mask/Inner panel content covering center */}
        <div className="relative bg-[#070709] rounded-[28px] p-4 sm:p-5 text-center select-none z-10 max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-[28px]" />

          {/* Close button with subtle outline active hover */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90, backgroundColor: "rgba(220, 38, 38, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-500 hover:text-white border border-transparent hover:border-red-500/30 transition-all duration-300 bg-white/5 z-20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Upper tech status indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-1 font-mono text-[8.5px] text-zinc-500 tracking-widest uppercase">
            <Cpu className="w-3 h-3 text-green-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>SISTEMA ATIVO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Heading with Neon text dropshadows */}
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight uppercase font-display select-none">
            BEM-VINDO!{" "}
            <span className="text-transparent bg-gradient-to-r from-green-400 via-pink-400 to-green-400 bg-clip-text animate-pulse">
              ESCOLHA UMA OPÇÃO:
            </span>
          </h2>
          <p className="text-[9.5px] text-zinc-500 font-mono tracking-wide mt-1 mb-3 max-w-[280px] mx-auto">
            Selecione seu perfil de acesso ao ecossistema regional
          </p>

          {/* Dynamic grid selection options */}
          <div className="grid grid-cols-1 gap-2 relative z-10">
            {options.map((item) => {
              const isHovered = hoveredOption === item.action;
              return (
                <motion.button
                  key={item.action}
                  onHoverStart={() => {
                    playClickSound(650, "triangle");
                    setHoveredOption(item.action);
                  }}
                  onHoverEnd={() => setHoveredOption(null)}
                  onClick={() => handleSelect(item.action)}
                  whileHover={{ 
                    scale: 1.015,
                    boxShadow: `0 0 20px ${item.glowColor}, inset 0 0 10px ${item.glowColor}`
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full relative flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-zinc-950/80 border ${
                    isHovered ? "border-white bg-[#0e0d11]" : "border-zinc-800/80"
                  } text-left text-xs font-bold transition-all duration-300 cursor-pointer overflow-hidden group`}
                >
                  {/* Glowing neon back-glow for hovered item */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        layoutId="btn-glow-back"
                        className="absolute inset-0 bg-gradient-to-r pointer-events-none mix-blend-screen opacity-15"
                        style={{ background: `linear-gradient(90deg, ${item.glowColor}, transparent)` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Left content block */}
                  <div className="flex items-center gap-2.5 z-15">
                    <div className={`p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 ${
                      isHovered ? "bg-white/10 border-white/20 text-white" : "text-zinc-400"
                    }`}>
                      <item.icon className={`w-3.5 h-3.5 transition-all duration-300 ${
                        isHovered ? "scale-110 text-white" : item.accentClass
                      }`} />
                    </div>
                    <div>
                      <span className={`block font-display text-[10.5px] tracking-wider uppercase transition-all duration-300 ${
                        isHovered ? "text-white font-extrabold translate-x-1" : "text-zinc-300"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Right hand dynamic tech accent tag */}
                  <div className="z-15 flex items-center gap-1.5">
                    <span className="text-[8px] font-mono tracking-widest text-zinc-600 group-hover:text-zinc-400 uppercase transition-colors duration-300">
                      Entrar
                    </span>
                    <motion.div 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isHovered ? "bg-white scale-125" : "bg-zinc-800"
                      }`}
                      animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Running cyber scanning line overlay effect on hover */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-y-0 w-1 bg-gradient-to-r from-white to-transparent pointer-events-none opacity-30"
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 0.85, ease: "easeInOut", repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Secure footnote with a high-fidelity vibe */}
          <div className="mt-3 pt-2.5 border-t border-zinc-900/50 flex items-center justify-center gap-1.5 text-zinc-600 text-[8px] font-mono tracking-wider">
            <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
            <span>PORTAL DO COMEÇO AO TOPO • 2026</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
