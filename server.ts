import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs, query } from "firebase/firestore";

dotenv.config();

// Load the firebase configuration that was generated natively
const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "firebase-applet-config.json"), "utf8"));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Helper inside routes to save base64 string to Firestore and return a URL
  async function saveBase64Image(base64Str: string): Promise<string> {
    if (!base64Str || !base64Str.startsWith("data:image/")) {
      return base64Str; // Return unchanged if not base64
    }
    try {
      // Store in firestore collection 'fs_uploads'
      const docRef = await addDoc(collection(db, "fs_uploads"), {
        data: base64Str,
        createdAt: Date.now()
      });
      return `/api/files/${docRef.id}`;
    } catch (err) {
      console.error("Error saving base64 image:", err);
      return base64Str; // fallback to base64
    }
  }

  let inMemoryDbCache: any = {
    photos: [],
    articles: [],
    comments: [],
    quem_somos_profile_pic: "",
    quem_somos_gallery: [],
    portalPagesConfig: null,
    logoConfig: null,
    gradientStyle: "",
    footerCredits: "",
    positionableImages: {},
    embaixadores_list: [],
    partners_list: [],
    rotating_ads: [],
    testimonials: [],
    community_plans: [],
    community_title: "",
    community_subtitle: "",
    advertising_plans: [],
    advertising_title: "",
    advertising_subtitle: "",
    advertising_whatsapp: "",
    community_enrollments: [],
    homepage_sections_order: ["ticker", "hero", "membership", "testimonials", "feed", "ads", "partners"]
  };

  // Load from Firestore
  async function loadDb() {
    try {
      const docSnap = await getDoc(doc(db, "portal", "config"));
      if (docSnap.exists()) {
        const data = docSnap.data();
        inMemoryDbCache = { ...inMemoryDbCache, ...data };
        return inMemoryDbCache;
      }
    } catch (e: any) {
      if (!e?.message?.includes("RESOURCE_EXHAUSTED")) {
        console.error("Error reading from Firestore", e);
      }
    }
    return inMemoryDbCache;
  }

  async function saveDb(data: any) {
    inMemoryDbCache = { ...inMemoryDbCache, ...data };
    try {
      await setDoc(doc(db, "portal", "config"), data);
    } catch (e: any) {
      if (!e?.message?.includes("RESOURCE_EXHAUSTED")) {
        console.error("Error writing to Firestore", e);
      }
    }
  }

  async function createVersionedBackup(data: any) {
    try {
      const backupId = `backup-${Date.now()}`;
      await setDoc(doc(db, "portal_backups", backupId), {
        versionId: backupId,
        timestamp: new Date().toISOString(),
        ...data
      });
    } catch (e: any) {
      if (!e?.message?.includes("RESOURCE_EXHAUSTED")) {
        console.error("Error creating versioned backup in Firestore", e);
      }
    }
  }

  // File serving endpoint (Firebase Firestore Image Proxy)
  app.get("/api/files/:id", async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, "fs_uploads", req.params.id));
      if (docSnap.exists()) {
        const docData = docSnap.data();
        if (docData && typeof docData.data === "string" && docData.data.startsWith("data:image/")) {
          const parts = docData.data.split(";base64,");
          const mimeType = parts[0].split(":")[1];
          const base64Data = parts[1];
          const buffer = Buffer.from(base64Data, "base64");
          
          res.setHeader("Content-Type", mimeType);
          return res.send(buffer);
        }
      }
      res.status(404).send("Not found");
    } catch (e) {
      res.status(500).send("Error");
    }
  });

  // Basic API router endpoints
  app.get("/api/published-data", async (req, res) => {
    const data = await loadDb();
    
    // Auto-heal/sync any ambassador uploaded pics from positionableImages back into embaixadores_list
    if (Array.isArray(data.embaixadores_list) && data.positionableImages) {
      data.embaixadores_list = data.embaixadores_list.map((amb: any, idx: number) => {
        const key = `ambassador-pic-${idx}-${amb.name}_uploaded_src`;
        if (data.positionableImages[key]) {
          return {
            ...amb,
            photoUrl: data.positionableImages[key]
          };
        }
        return amb;
      });
    }
    
    res.json(data);
  });

  let inMemoryVisitorCount = 1420;

  app.get("/api/visitors", async (req, res) => {
    try {
      const docSnap = await getDoc(doc(db, "portal", "visitors"));
      if (docSnap.exists()) {
        inMemoryVisitorCount = docSnap.data().count || inMemoryVisitorCount;
      }
    } catch (err: any) {
      // silent fallback
    }
    res.json({ count: inMemoryVisitorCount });
  });

  app.options("/api/visitors-inc", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(200);
  });

  app.post("/api/visitors-inc", async (req, res) => {
    console.log("POST /api/visitors-inc called");
    inMemoryVisitorCount += 1;
    try {
      const docRef = doc(db, "portal", "visitors");
      await setDoc(docRef, { count: inMemoryVisitorCount });
    } catch (err: any) {
      console.error("Error in POST /api/visitors-inc:", err);
      // silent fallback, do not fail request
    }
    res.set("Access-Control-Allow-Origin", "*");
    res.json({ count: inMemoryVisitorCount });
  });

  // User Management & Approval Control Endpoints
  const ADMIN_EMAILS = ["admin@docomecoatopo.com.br", "diretoria@portal.com", "abautosmaooe@gmail.com"];

  app.get("/api/users", async (req, res) => {
    try {
      const usersCol = collection(db, "portal_users");
      const snapshot = await getDocs(usersCol);
      const usersList: any[] = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data());
      });
      // Sort so newest or pending are visible
      usersList.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      res.json({ users: usersList });
    } catch (err: any) {
      console.error("Error fetching users list:", err);
      res.status(500).json({ error: err.message, users: [] });
    }
  });

  app.post("/api/users/sync", async (req, res) => {
    try {
      const { email, name, photoUrl, uid } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const cleanEmail = email.toLowerCase().trim();
      const docId = cleanEmail.replace(/[^a-z0-9]/g, "_");
      const userRef = doc(db, "portal_users", docId);
      const userSnap = await getDoc(userRef);

      let record: any;
      const isAdminEmail = ADMIN_EMAILS.includes(cleanEmail);

      if (userSnap.exists()) {
        record = userSnap.data();
        record.lastLogin = new Date().toISOString();
        if (name && !record.name) record.name = name;
        if (photoUrl && !record.photoUrl) record.photoUrl = photoUrl;
        if (isAdminEmail && record.status !== "approved") record.status = "approved";
        await setDoc(userRef, record, { merge: true });
      } else {
        record = {
          uid: uid || docId,
          email: cleanEmail,
          name: name || cleanEmail.split("@")[0] || "Usuário",
          photoUrl: photoUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(cleanEmail)}`,
          status: isAdminEmail ? "approved" : "suspended",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await setDoc(userRef, record);
      }

      res.json({ user: record, isAdmin: isAdminEmail });
    } catch (err: any) {
      console.error("Error syncing user record:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/users/:email/status", async (req, res) => {
    try {
      const { email } = req.params;
      const { status, trialDays } = req.body;
      const cleanEmail = decodeURIComponent(email).toLowerCase().trim();
      const docId = cleanEmail.replace(/[^a-z0-9]/g, "_");
      const userRef = doc(db, "portal_users", docId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const updates: any = { status };
      if (status === "trial") {
        const days = typeof trialDays === "number" ? trialDays : 14;
        updates.trialEndsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      await updateDoc(userRef, updates);
      const updatedSnap = await getDoc(userRef);
      res.json({ success: true, user: updatedSnap.data() });
    } catch (err: any) {
      console.error("Error updating user status:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/publish-all", async (req, res) => {
    try {
      const dbData = await loadDb();
      const { portalPagesConfig, logoConfig, gradientStyle, footerCredits, quem_somos_profile_pic, positionableImages, embaixadores_list, podcasts, articles, partners_list, rotating_ads, testimonials, community_plans, community_title, community_subtitle, advertising_plans, advertising_title, advertising_subtitle, advertising_whatsapp, homepage_sections_order } = req.body;
      
      if (articles && Array.isArray(articles)) {
        dbData.articles = articles;
      }

      if (podcasts && Array.isArray(podcasts)) {
        dbData.podcasts = podcasts;
      }

      if (partners_list && Array.isArray(partners_list)) {
        dbData.partners_list = partners_list;
      }

      if (rotating_ads && Array.isArray(rotating_ads)) {
        dbData.rotating_ads = rotating_ads;
      }

      if (testimonials && Array.isArray(testimonials)) {
        dbData.testimonials = testimonials;
      }

      if (community_plans && Array.isArray(community_plans)) {
        dbData.community_plans = community_plans;
      }

      if (community_title !== undefined) {
        dbData.community_title = community_title;
      }

      if (community_subtitle !== undefined) {
        dbData.community_subtitle = community_subtitle;
      }

      if (advertising_plans && Array.isArray(advertising_plans)) {
        dbData.advertising_plans = advertising_plans;
      }

      if (advertising_title !== undefined) {
        dbData.advertising_title = advertising_title;
      }

      if (advertising_subtitle !== undefined) {
        dbData.advertising_subtitle = advertising_subtitle;
      }

      if (advertising_whatsapp !== undefined) {
        dbData.advertising_whatsapp = advertising_whatsapp;
      }

      if (homepage_sections_order !== undefined) {
        dbData.homepage_sections_order = homepage_sections_order;
      }

      if (embaixadores_list !== undefined) {
        const processedAmbassadors = [];
        if (Array.isArray(embaixadores_list)) {
          for (let idx = 0; idx < embaixadores_list.length; idx++) {
            const amb = embaixadores_list[idx];
            let processedUrl = amb.photoUrl;
            if (typeof processedUrl === "string" && processedUrl.startsWith("data:image/")) {
              try {
                processedUrl = await saveBase64Image(processedUrl);
              } catch (err) {
                console.error("Failed to convert base64 image for ambassador: " + amb.name, err);
              }
            }
            
            // Auto-heal/restore from dbData.positionableImages if the incoming image url is fallback/unsplash or empty
            const key = `ambassador-pic-${idx}-${amb.name}_uploaded_src`;
            const isFallbackImg = !processedUrl || processedUrl.includes("images.unsplash.com") || processedUrl === "undefined" || processedUrl === "null";
            if (isFallbackImg && dbData.positionableImages && dbData.positionableImages[key]) {
              processedUrl = dbData.positionableImages[key];
            }

            processedAmbassadors.push({
              ...amb,
              photoUrl: processedUrl
            });
            // Also store/sync into positionableImages under the correct storageKey
            if (processedUrl) {
              if (!dbData.positionableImages) {
                dbData.positionableImages = {};
              }
              dbData.positionableImages[key] = processedUrl;
            }
          }
        }
        dbData.embaixadores_list = processedAmbassadors;
      }
      if (portalPagesConfig) {
        dbData.portalPagesConfig = portalPagesConfig;
      }
      if (logoConfig) {
        if (logoConfig.customImageUrl && logoConfig.customImageUrl.startsWith("data:image/")) {
          logoConfig.customImageUrl = await saveBase64Image(logoConfig.customImageUrl);
        }
        dbData.logoConfig = logoConfig;
      }
      if (gradientStyle !== undefined) {
        dbData.gradientStyle = gradientStyle;
      }
      if (footerCredits !== undefined) {
        dbData.footerCredits = footerCredits;
      }
      if (quem_somos_profile_pic !== undefined) {
        if (quem_somos_profile_pic && quem_somos_profile_pic.startsWith("data:image/")) {
          dbData.quem_somos_profile_pic = await saveBase64Image(quem_somos_profile_pic);
        } else {
          dbData.quem_somos_profile_pic = quem_somos_profile_pic;
        }
      }
      if (positionableImages !== undefined) {
        // MERGE rather than overwrite to prevent deleting other users / other sessions uploads
        const processedImages: Record<string, any> = { ...(dbData.positionableImages || {}) };
        for (const [key, val] of Object.entries(positionableImages)) {
          if (typeof val === "string" && val.startsWith("data:image/")) {
            try {
              processedImages[key] = await saveBase64Image(val);
            } catch (err: any) {
              console.error("Failed to convert base64 positionable image: " + key, err);
              processedImages[key] = val;
            }
          } else {
            processedImages[key] = val;
          }
        }
        dbData.positionableImages = processedImages;
      }

      await saveDb(dbData);
      await createVersionedBackup(dbData);
      res.json({ status: "success", db: dbData });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/update-positionable-image", async (req, res) => {
    try {
      const dbData = await loadDb();
      const { key, val, coords } = req.body;
      if (!key) {
        return res.status(400).json({ error: "Key is required" });
      }
      if (!dbData.positionableImages) {
        dbData.positionableImages = {};
      }
      
      if (val !== undefined) {
        if (val.startsWith("data:image/")) {
          dbData.positionableImages[`${key}_uploaded_src`] = await saveBase64Image(val);
        } else {
          dbData.positionableImages[`${key}_uploaded_src`] = val;
        }
      }
      if (coords !== undefined) {
        dbData.positionableImages[key] = coords;
      }
      
      await saveDb(dbData);
      res.json({ status: "success" });
    } catch (e: any) {
       res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/photos", async (req, res) => {
    const dbData = await loadDb();
    const { gallery } = req.query;
    if (gallery) {
      return res.json(dbData.photos.filter((p: any) => p.gallery === gallery));
    }
    res.json(dbData.photos);
  });

  app.post("/api/photos", async (req, res) => {
    const dbData = await loadDb();
    const { gallery, item } = req.body;

    if (!item) {
      return res.status(400).json({ error: "Item missing" });
    }

    try {
      if (item.url && item.url.startsWith("data:image/")) {
        item.url = await saveBase64Image(item.url);
      }
      const newPhoto = {
        ...item,
        gallery: gallery || item.gallery || "global",
        id: item.id || `photo-${Date.now()}`,
        date: item.date || new Date().toISOString().split("T")[0]
      };

      dbData.photos = dbData.photos.filter((p: any) => p.id !== newPhoto.id);
      dbData.photos.unshift(newPhoto);
      await saveDb(dbData);

      res.status(201).json(newPhoto);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    const dbData = await loadDb();
    dbData.photos = dbData.photos.filter((p: any) => p.id !== req.params.id);
    await saveDb(dbData);
    res.json({ status: "ok" });
  });

  app.get("/api/articles", async (req, res) => {
    const dbData = await loadDb();
    res.json(dbData.articles);
  });

  app.post("/api/articles", async (req, res) => {
    const dbData = await loadDb();
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: "Item missing" });
    }

    try {
      if (item.image && typeof item.image === "string" && item.image.startsWith("data:image/")) {
        item.image = await saveBase64Image(item.image);
      }
      if (item.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.startsWith("data:image/")) {
        item.imageUrl = await saveBase64Image(item.imageUrl);
      }
      const newArticle = {
        ...item,
        id: item.id || `art-${Date.now()}`,
        date: item.date || new Date().toISOString()
      };

      dbData.articles = dbData.articles.filter((a: any) => a.id !== newArticle.id);
      dbData.articles.unshift(newArticle);
      await saveDb(dbData);

      res.status(201).json(newArticle);
    } catch (e: any) {
      console.error("Error saving article in server:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    const dbData = await loadDb();
    dbData.articles = dbData.articles.filter((a: any) => a.id !== req.params.id);
    await saveDb(dbData);
    res.json({ status: "ok" });
  });

  app.get("/api/profile-pic", async (req, res) => {
    const dbData = await loadDb();
    res.json({ url: dbData.quem_somos_profile_pic });
  });

  app.post("/api/profile-pic", async (req, res) => {
    const dbData = await loadDb();
    const { image } = req.body;
    try {
      if (image) {
        const url = await saveBase64Image(image);
        dbData.quem_somos_profile_pic = url;
        await saveDb(dbData);
        res.json({ url });
      } else {
        dbData.quem_somos_profile_pic = "";
        await saveDb(dbData);
        res.json({ url: "" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/quem-somos-gallery", async (req, res) => {
    const dbData = await loadDb();
    res.json(dbData.quem_somos_gallery);
  });

  app.post("/api/quem-somos-gallery", async (req, res) => {
    const dbData = await loadDb();
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: "Item missing" });

    try {
      if (item.url && item.url.startsWith("data:image/")) {
        item.url = await saveBase64Image(item.url);
      }
      dbData.quem_somos_gallery = dbData.quem_somos_gallery.filter((g: any) => g.id !== item.id);
      dbData.quem_somos_gallery.unshift(item);
      await saveDb(dbData);
      res.json(item);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/quem-somos-gallery/:id", async (req, res) => {
    const dbData = await loadDb();
    dbData.quem_somos_gallery = dbData.quem_somos_gallery.filter((g: any) => g.id !== req.params.id);
    await saveDb(dbData);
    res.json({ status: "ok" });
  });

  
  app.post("/api/google-search", async (req, res) => {
    try {
      const { query } = req.body;
      const searchQuery = (query || "Portal Do Começo ao Topo Juiz de Fora").trim();

      // Fetch RSS feed results as web search results
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`;
      const fetchRes = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });

      let items: any[] = [];
      if (fetchRes.ok) {
        const xml = await fetchRes.text();
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
          const itemXml = match[1];
          const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
          const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
          const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
          const sourceMatch = itemXml.match(/<source[\s\S]*?>([\s\S]*?)<\/source>/);

          if (titleMatch) {
            let title = titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
            const link = linkMatch ? linkMatch[1].trim() : `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
            const source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : "Google News";

            items.push({
              title,
              snippet: `Resultado da busca no Google para "${searchQuery}". Clique para abrir a matéria original.`,
              url: link,
              pubDate,
              source
            });
          }
        }
      }

      if (items.length === 0) {
        items = [
          {
            title: `Resultados do Google para: ${searchQuery}`,
            snippet: `Confira os principais artigos, notícias e novidades relevantes sobre ${searchQuery} diretamente no ecossistema de buscas do Google.`,
            url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
            pubDate: new Date().toLocaleDateString("pt-BR"),
            source: "Google Web Search"
          }
        ];
      }

      res.json({ query: searchQuery, results: items });
    } catch (err: any) {
      console.error("Google Search API Error:", err);
      res.status(500).json({ 
        query: req.body?.query || "", 
        results: [
          {
            title: `Buscar "${req.body?.query || 'Negócios Juiz de Fora'}" no Google`,
            snippet: `Clique no link abaixo para realizar a consulta em tempo real no buscador oficial do Google.`,
            url: `https://www.google.com/search?q=${encodeURIComponent(req.body?.query || 'Portal Do Começo ao Topo')}`,
            pubDate: "Agora",
            source: "Google Search Direct"
          }
        ] 
      });
    }
  });

  app.post("/api/assistant", async (req, res) => {
    const { history, message } = req.body;
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
      }
      
      const dbData = await loadDb();
      
      const portalConfig = dbData.portalPagesConfig || {};
      const articles = dbData.articles || [];
      const embaixadores = dbData.embaixadores_list || [];
      const podcasts = dbData.podcasts || [];
      
      const contextText = `
Você é a Topina, assistente virtual inteligente e amiga do 'Do Começo Ao Topo - Portal de Negócios'.
Seu tom de voz é acolhedor, profissional, simpático e entusiasmado com o desenvolvimento econômico e cultural da Zona da Mata e Sudeste Mineiro!

Você tem conhecimento profundo sobre todo o ecossistema do Portal:
1. ANÚNCIOS & MARCAS PARCEIRAS:
   - Banners Rotativos da Rede (Marcas Parceiras & Patrocinadores), notícias regionais e Podcast!
   - Planos de Anúncio: Standard, Gold e Master/Fundador (a partir de R$ 197,00/mês).

2. COMUNIDADE VIP & MEMBROS:
   - Hub de networking presencial e digital para empreendedores e executivos. Mentorias, rodadas de negócios e descontos.

3. CONTEÚDO & MÍDIA:
   - Notícias diárias sobre Juiz de Fora, Ubá, Barbacena, Matias Barbosa, Goianá e região.
   - Podcasts semanais com grandes lideranças dos negócios.
   - Galerias de fotos dos maiores eventos empresariais do Sudeste.

4. QUEM SOMOS & CONTATO:
   - ${portalConfig.quemSomosP1 || 'O Portal Do Começo ao Topo é o hub de negócios e entretenimento que conecta e descentraliza a cultura e o empreendedorismo regional.'}
   - Localização: ${portalConfig.ondeEstamosLocation || 'Rua Ataliba de Barros, 182 - Sala 1107, Estrela Sul - Juiz de Fora - MG'}.
   - Suporte Humano via WhatsApp: (32) 99194-7690.

ORIENTAÇÕES DE RESPOSTA:
- Responda em português fluído, simpático, claro e bem formatado.
- Se o usuário perguntar algo genérico ou externo, utilize o Google Search Grounding integrado para trazer informações precisas.
`;

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const fullPrompt = `
Histórico da conversa:
${(history || []).map((m: any) => `[${m.sender}]: ${m.text}`).join('\n')}

Usuário: ${message}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction: contextText,
          tools: [{ googleSearch: {} }],
          temperature: 0.7,
        }
      });
      
      // Extract grounding metadata if available
      let groundingChunks: any[] = [];
      try {
        const candidate = (response as any).candidates?.[0];
        if (candidate?.groundingMetadata?.groundingChunks) {
          groundingChunks = candidate.groundingMetadata.groundingChunks;
        }
      } catch (e) {
        // ignore fallback
      }

      res.json({ 
        reply: response.text,
        groundingChunks
      });
    } catch (e: any) {
        console.error(e);
        require('fs').writeFileSync('error.log', e.toString() + '\n' + e.stack);
        res.status(500).json({ error: "Erro no assistente." });
    }
  });

  app.post("/api/community-enrollment", async (req, res) => {
    try {
      const dbData = await loadDb();
      if (!dbData.community_enrollments) dbData.community_enrollments = [];
      const newEnrollment = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...req.body
      };
      dbData.community_enrollments.push(newEnrollment);
      await saveDb(dbData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving enrollment", error);
      res.status(500).json({ error: "Failed to save enrollment" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const { name, email, msg } = req.body;
    
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing email configuration");
      return res.status(500).json({ error: "Email server configuration is incomplete" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: "andersonpsan@gmail.com, podcastdocomecoaotopojf@gmail.com",
        subject: "Nova mensagem de contato - Portal",
        text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${msg}`,
      });
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/upload-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image || !image.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image format" });
      }
      const url = await saveBase64Image(image);
      res.json({ url });
    } catch (e: any) {
      console.error("Image upload failed:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/resolve-image-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }
      
      const cleanUrl = url.trim();
      // If it is not an ImgBB page link, or is already direct, return immediately
      if (!cleanUrl.includes("ibb.co/") || cleanUrl.includes("i.ibb.co") || cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return res.json({ url: cleanUrl });
      }

      console.log("Resolving ImgBB URL:", cleanUrl);
      const response = await fetch(cleanUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (!response.ok) {
        return res.json({ url: cleanUrl });
      }
      const html = await response.text();
      
      // Match og:image or twitter:image contents
      const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogMatch && ogMatch[1]) {
        console.log("Resolved via og:image:", ogMatch[1]);
        return res.json({ url: ogMatch[1] });
      }

      const ogMatch2 = html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
      if (ogMatch2 && ogMatch2[1]) {
        console.log("Resolved via og:image alt:", ogMatch2[1]);
        return res.json({ url: ogMatch2[1] });
      }

      const directMatch = html.match(/(https:\/\/i\.ibb\.co\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp))/i);
      if (directMatch && directMatch[0]) {
        console.log("Resolved via regex pattern:", directMatch[0]);
        return res.json({ url: directMatch[0] });
      }

      res.json({ url: cleanUrl });
    } catch (err: any) {
      console.error("Error resolving image URL:", err);
      res.json({ url: req.body?.url || "" });
    }
  });


  // In-memory cache for Live Google News
  let liveNewsCache: any[] = [];
  let lastLiveNewsFetch = 0;
  const NEWS_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  function decodeHtmlEntities(str: string): string {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—")
      .replace(/&middot;/g, "·")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/")
      .replace(/&deg;/g, "°");
  }

  async function fetchRssFeed(url: string, defaultCity: string): Promise<any[]> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!response.ok) return [];
      const text = await response.text();
      
      const items: any[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      while ((match = itemRegex.exec(text)) !== null && items.length < 15) {
        const itemContent = match[1];
        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const sourceMatch = itemContent.match(/<source[\s\S]*?>([\s\S]*?)<\/source>/);
        
        if (titleMatch) {
          let title = titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
          const link = linkMatch ? linkMatch[1].trim() : "https://news.google.com";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
          const source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim() : "Google News";
          
          // Clean title
          const suffix = ` - ${source}`;
          if (title.toLowerCase().endsWith(suffix.toLowerCase())) {
            title = title.substring(0, title.length - suffix.length).trim();
          }
          
          title = decodeHtmlEntities(title);
          
          // Determine city/tag
          let city = defaultCity;
          if (defaultCity === "Outras") {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes("ubá")) {
              city = "Ubá";
            } else if (lowerTitle.includes("barbacena")) {
              city = "Barbacena";
            } else if (lowerTitle.includes("matias barbosa")) {
              city = "Matias Barbosa";
            } else if (lowerTitle.includes("rodeiro")) {
              city = "Rodeiro";
            } else if (lowerTitle.includes("coronel pacheco")) {
              city = "Coronel Pacheco";
            } else if (lowerTitle.includes("goianá")) {
              city = "Goianá";
            } else {
              city = "Zona da Mata";
            }
          } else if (defaultCity === "Geral") {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes("juiz de fora") || lowerTitle.includes(" jf")) {
              city = "Juiz de Fora";
            } else {
              city = "Negócios";
            }
          }
          
          items.push({
            id: `feed-${Math.random().toString(36).substr(2, 9)}`,
            city,
            title,
            link,
            pubDate,
            source
          });
        }
      }
      return items;
    } catch (e) {
      console.error("Error fetching feed:", url, e);
      return [];
    }
  }

  const FALLBACK_LOCAL_HEADLINES = [
    {
      id: "fallback-1",
      city: "Juiz de Fora",
      title: "Independência Shopping anuncia expansão de novas lojas para o segundo semestre",
      link: "https://news.google.com",
      pubDate: new Date().toUTCString(),
      source: "Portal Do Começo ao Topo"
    },
    {
      id: "fallback-2",
      city: "Zona da Mata",
      title: "Setor de tecnologia na Zona da Mata registra alta de 22% em novas contratações",
      link: "https://news.google.com",
      pubDate: new Date().toUTCString(),
      source: "Agência Regional MG"
    },
    {
      id: "fallback-3",
      city: "Matias Barbosa",
      title: "Prefeitura realiza rodada de negócios voltada para produtores rurais e empreendedores locais",
      link: "https://news.google.com",
      pubDate: new Date().toUTCString(),
      source: "Gazeta Regional"
    }
  ];

  app.get("/api/google-news", async (req, res) => {
    try {
      const now = Date.now();
      if (liveNewsCache.length > 0 && (now - lastLiveNewsFetch) < NEWS_CACHE_DURATION) {
        return res.json({ items: liveNewsCache });
      }

      const jfUrl = `https://news.google.com/rss/search?q=Juiz+de+Fora&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`;
      const regionUrl = `https://news.google.com/rss/search?q=Zona+da+Mata+MG+OR+Uba+MG+OR+Barbacena+MG&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`;
      const nationalUrl = `https://news.google.com/rss/search?q=negocios+tecnologia+brasil&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`;

      const [jfItems, regionItems, nationalItems] = await Promise.all([
        fetchRssFeed(jfUrl, "Juiz de Fora").catch(() => []),
        fetchRssFeed(regionUrl, "Outras").catch(() => []),
        fetchRssFeed(nationalUrl, "Geral").catch(() => [])
      ]);

      // Combine items, interleaving them so user gets a varied list of news!
      const combined: any[] = [];
      const maxLength = Math.max(jfItems.length, regionItems.length, nationalItems.length);
      for (let i = 0; i < maxLength; i++) {
        if (jfItems[i]) combined.push(jfItems[i]);
        if (regionItems[i]) combined.push(regionItems[i]);
        if (nationalItems[i]) combined.push(nationalItems[i]);
      }

      if (combined.length > 0) {
        liveNewsCache = combined;
        lastLiveNewsFetch = now;
      } else if (liveNewsCache.length === 0) {
        liveNewsCache = FALLBACK_LOCAL_HEADLINES;
      }

      res.json({ items: liveNewsCache.length > 0 ? liveNewsCache : FALLBACK_LOCAL_HEADLINES });
    } catch (e: any) {
      res.json({ items: liveNewsCache.length > 0 ? liveNewsCache : FALLBACK_LOCAL_HEADLINES });
    }
  });


  app.get("/api/news-rss", async (req, res) => {
    try {
      const city = req.query.city || "";
      const query = "eventos " + city + " Brasil";
      // Google News RSS URL
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR%3Apt-419`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (!response.ok) {
        return res.status(500).json({ error: "Failed to fetch RSS" });
      }
      
      const xml = await response.text();
      
      // Basic Regex to extract items
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        
        const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
        
        if (titleMatch) {
          items.push({
            title: titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'),
            link: linkMatch ? linkMatch[1] : "",
            pubDate: pubDateMatch ? pubDateMatch[1] : "",
            description: descMatch ? descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1') : "",
          });
        }
      }
      
      res.json({ items: items.slice(0, 10) }); // Return top 10 per city
    } catch (e: any) {
      console.error("RSS route error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Determine if we are running in production mode

  const isProduction = process.env.NODE_ENV === "production" || 
                        (process.env.NODE_ENV !== "development" && fs.existsSync(path.resolve(process.cwd(), "dist")));

  // Vite middleware for development
  if (!isProduction) {
    const vitePkg = "vite";
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
