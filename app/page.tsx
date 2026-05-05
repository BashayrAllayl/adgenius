"use client";

import { useState } from "react";
const API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_KEY;

/* ================== STYLES ================== */
const styles: any = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #070b12 0%, #0d1421 50%, #111b2e 100%)",
    fontFamily: "'Cairo', 'Tajawal', sans-serif",
    color: "#e8f4fd",
    direction: "rtl",
    padding: "0 0 40px 0",
  },
  header: {
    background: "rgba(13,20,33,0.95)",
    borderBottom: "1px solid #1e2d47",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(20px)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 40, height: 40,
    background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
    borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20,
    boxShadow: "0 0 20px rgba(0,212,255,0.3)",
  },
  logoText: {
    fontSize: 18, fontWeight: 900,
    background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoSub: { fontSize: 11, color: "#6b8aad" },
  aiBadge: {
    background: "linear-gradient(90deg, #7c3aed, #00d4ff)",
    color: "white", fontSize: 10,
    padding: "2px 8px", borderRadius: 20, fontWeight: 700,
  },
  tabs: {
    display: "flex",
    background: "#0d1421",
    borderBottom: "1px solid #1e2d47",
    overflowX: "auto",
  },
 tab: (active: boolean) => ({
  padding: "12px 16px",
  fontSize: 13,
  fontWeight: active ? 700 : 400,
  color: active ? "#00d4ff" : "#6b8aad",
  borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
  cursor: "pointer",
  whiteSpace: "nowrap",
  background: "none",
  border: "none",
  fontFamily: "inherit",
}),
  content: { padding: "16px" },
  card: {
    background: "#111b2e",
    border: "1px solid #1e2d47",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14, fontWeight: 700,
    display: "flex", alignItems: "center", gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 11, color: "#6b8aad",
    textTransform: "uppercase", letterSpacing: 1,
    fontWeight: 700, marginBottom: 6, display: "block",
  },
  input: {
    width: "100%",
    background: "#0d1421",
    border: "1px solid #1e2d47",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#e8f4fd",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    marginBottom: 12,
    boxSizing: "border-box",
    direction: "rtl",
  },
  textarea: {
    width: "100%",
    background: "#0d1421",
    border: "1px solid #1e2d47",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#e8f4fd",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    marginBottom: 12,
    boxSizing: "border-box",
    direction: "rtl",
    minHeight: 80,
    resize: "vertical",
  },
  chipsRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  chip: (sel: boolean, color: string = "#00d4ff") => ({
    padding: "6px 12px",
    borderRadius: 8,
    border: `1px solid ${sel ? color : "#1e2d47"}`,
    background: sel ? `rgba(0,212,255,0.08)` : "#0d1421",
    color: sel ? color : "#6b8aad",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  }),
  generateBtn: (loading: boolean) => ({
    width: "100%",
    padding: 14,
    background: loading
      ? "rgba(124,58,237,0.5)"
      : "linear-gradient(135deg, #7c3aed, #1d6ef5, #00d4ff)",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: 4,
    boxShadow: loading ? "none" : "0 4px 20px rgba(0,212,255,0.25)",
  }),
  outputBox: {
    background: "#0d1421",
    border: "1px solid #1e2d47",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  outputHeader: {
    fontSize: 11, color: "#00d4ff",
    textTransform: "uppercase", letterSpacing: 1,
    fontWeight: 700, marginBottom: 10,
    display: "flex", alignItems: "center", gap: 6,
  },
  outputText: {
    fontSize: 14, lineHeight: 1.9,
    color: "#e8f4fd", whiteSpace: "pre-wrap",
  },
  actionRow: {
    display: "flex", gap: 8, marginTop: 12,
    paddingTop: 12, borderTop: "1px solid #1e2d47",
    flexWrap: "wrap",
  },
  btnSmall: (variant: string) => ({
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 12, fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    border: variant === "accent"
      ? "1px solid rgba(0,212,255,0.3)"
      : variant === "primary"
      ? "none"
      : "1px solid #1e2d47",
    background: variant === "accent"
      ? "rgba(0,212,255,0.08)"
      : variant === "primary"
      ? "linear-gradient(135deg, #7c3aed, #00d4ff)"
      : "transparent",
    color: variant === "accent" ? "#00d4ff"
      : variant === "primary" ? "white" : "#6b8aad",
  }),
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  statCard: (color: string) => ({
    background: "#111b2e",
    border: "1px solid #1e2d47",
    borderRadius: 14,
    padding: 14,
  }),
  statVal: (color: string) => ({
    fontFamily: "inherit",
    fontSize: 24, fontWeight: 900,
    color: color, marginBottom: 2,
  }),
  statLabel: { fontSize: 11, color: "#6b8aad" },
  statChange: (up: boolean) => ({
    fontSize: 11, fontWeight: 600,
    color: up ? "#10b981" : "#ef4444",
    marginTop: 4,
  }),
  campItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 0",
    borderBottom: "1px solid #1e2d47",
  },
  campIcon: (bg: string) => ({
    width: 38, height: 38, borderRadius: 10,
    background: bg, display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: 18, flexShrink: 0,
  }),
  campName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
  campMeta: { fontSize: 11, color: "#6b8aad" },
  statusBadge: (type: string) => ({
    fontSize: 10, padding: "3px 8px", borderRadius: 20, fontWeight: 700,
    background: type === "active" ? "rgba(16,185,129,0.15)"
      : type === "paused" ? "rgba(245,158,11,0.15)"
      : "rgba(107,138,173,0.15)",
    color: type === "active" ? "#10b981"
      : type === "paused" ? "#f59e0b"
      : "#6b8aad",
    flexShrink: 0,
  }),
  insightItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 0", borderBottom: "1px solid #1e2d47",
  },
  dot: (color: string) => ({
    width: 8, height: 8, borderRadius: "50%",
    background: color, flexShrink: 0,
  }),
  insightText: { fontSize: 12, color: "#6b8aad", flex: 1, lineHeight: 1.5 },
  insightVal: { fontSize: 13, fontWeight: 700, flexShrink: 0 },
};

const CAMPAIGNS = [
  { icon: "👟", bg: "rgba(0,212,255,0.1)", name: "أحذية رياضية صيف 2025", meta: "إنستغرام · فيسبوك", status: "active" },
  { icon: "🍕", bg: "rgba(255,107,53,0.1)", name: "عروض رمضان — المطعم", meta: "تيك توك · سناب شات", status: "active" },
  { icon: "📱", bg: "rgba(124,58,237,0.1)", name: "تطبيق ذكي للمحاسبة", meta: "جوجل · لينكدإن", status: "paused" },
  { icon: "🏠", bg: "rgba(245,158,11,0.1)", name: "عقارات الرياض", meta: "فيسبوك · تويتر", status: "active" },
  { icon: "✈️", bg: "rgba(0,212,255,0.1)", name: "رحلات سياحية أوروبا", meta: "جوجل · فيسبوك", status: "active" },
  { icon: "🎮", bg: "rgba(239,68,68,0.1)", name: "إطلاق لعبة الجيل القادم", meta: "تيك توك · تويتر", status: "paused" },
];

const INSIGHTS = [
  { color: "#10b981", text: "أفضل وقت نشر: الخميس 8-10م", val: "+22%", valColor: "#10b981" },
  { color: "#00d4ff", text: "الجمهور 25-34 الأكثر تفاعلاً", val: "64%", valColor: "#00d4ff" },
  { color: "#ff6b35", text: "الفيديو يحقق 3x في إنستغرام", val: "×3", valColor: "#ff6b35" },
  { color: "#f59e0b", text: "زد ميزانية حملة الأحذية", val: "ROI 8x", valColor: "#f59e0b" },
  { color: "#7c3aed", text: "أوقف حملة السفر مؤقتاً", val: "–15%", valColor: "#6b8aad" },
];

const TONES = ["احترافي", "عاطفي", "مرح", "عصري", "ملهم", "مباشر"];
const PLATFORMS = ["📘 فيسبوك", "📸 إنستغرام", "🐦 تويتر", "📱 تيك توك", "🔍 جوجل", "💼 لينكدإن", "🎵 سناب شات"];
const TYPES = ["📝 نص إعلاني", "🏷️ شعار وعنوان", "📧 بريد إلكتروني", "💡 أفكار إبداعية", "📊 استراتيجية"];

export default function Page() {
  const [tab, setTab] = useState("dashboard");
  const [product, setProduct] = useState("");
  const [goal, setGoal] = useState("");
  const [audience, setAudience] = useState("");
  const [budget, setBudget] = useState("");
  const [tone, setTone] = useState("احترافي");
  const [platforms, setPlatforms] = useState(["📘 فيسبوك", "📸 إنستغرام"]);
  const [types, setTypes] = useState(["📝 نص إعلاني", "🏷️ شعار وعنوان"]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleArr = (arr: string[], setArr: (arr: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v: string) => v !== val) : [...arr, val]);
  };

  const generate = async () => {
    if (!product.trim()) return;
    setLoading(true);
    setOutput("");
    const prompt = `أنت خبير تسويق رقمي ومبدع إعلاني. اكتب حملة إعلانية احترافية باللغة العربية:

المنتج/الخدمة: ${product}
هدف الحملة: ${goal || "زيادة المبيعات"}
الجمهور المستهدف: ${audience || "عام"}
الميزانية: ${budget || "غير محددة"}
نبرة الحملة: ${tone}
المنصات: ${platforms.join("، ")}
المطلوب: ${types.join("، ")}

قدّم:
1. 🎯 عنوان رئيسي مميز وجذّاب
2. ✍️ نص إعلاني قصير (2-3 جمل مقنعة)
3. 📢 دعوة لاتخاذ إجراء (Call to Action)
4. 💡 3 أفكار إبداعية لتنفيذ الحملة
5. 🎨 اقتراح المحتوى البصري المناسب`;

    try {
      
      const res = await fetch("/api/generate", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
          
          
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c: any) => c.text || "").join("") || "حدث خطأ، حاول مجدداً.";
      setOutput(text);
    } catch {
      setOutput("⚠️ حدث خطأ في الاتصال. تحقق من اتصالك وحاول مجدداً.");
    }
    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveCampaign = () => {
    const icons = ["🚀", "⭐", "💎", "🔥", "🌟"];
    const bgs = ["rgba(0,212,255,0.1)", "rgba(255,107,53,0.1)", "rgba(124,58,237,0.1)"];
    setCampaigns(prev => [{
      icon: icons[Math.floor(Math.random() * icons.length)],
      bg: bgs[Math.floor(Math.random() * bgs.length)],
      name: product || "حملة جديدة",
      meta: platforms.slice(0, 2).join(" · "),
      status: "draft",
    }, ...prev]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.app}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>⚡</div>
          <div>
            <div style={styles.logoText}>AdGenius AI</div>
            <div style={styles.logoSub}>منصة الحملات الذكية</div>
          </div>
        </div>
        <span style={styles.aiBadge}>AI</span>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {[
          { id: "dashboard", label: "📊 الرئيسية" },
          { id: "generate", label: "✨ توليد حملة" },
          { id: "campaigns", label: "🎯 الحملات" },
          { id: "insights", label: "💡 توصيات" },
        ].map(t => (
          <button key={t.id} style={styles.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>



        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div style={styles.statsGrid}>
              {[
                { icon: "📣", val: "12", label: "حملة نشطة", change: "↑ 3 هذا الأسبوع", up: true, color: "#00d4ff" },
                { icon: "👁️", val: "2.4M", label: "المشاهدات", change: "↑ 18% عن الأمس", up: true, color: "#ff6b35" },
                { icon: "💰", val: "47.3K", label: "ريال إنفاق", change: "↓ 5% عن الأمس", up: false, color: "#f59e0b" },
                { icon: "🎯", val: "4.8%", label: "معدل التحويل", change: "↑ 0.6% هذا الأسبوع", up: true, color: "#10b981" },
              ].map((s, i) => (
                <div key={i} style={styles.statCard(s.color)}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={styles.statVal(s.color)}>{s.val}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                  <div style={styles.statChange(s.up)}>{s.change}</div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>🚀 ابدأ الآن</div>
              <p style={{ fontSize: 13, color: "#6b8aad", lineHeight: 1.7, marginBottom: 14 }}>
                استخدم الذكاء الاصطناعي لإنشاء حملة إعلانية احترافية في ثوانٍ!
              </p>
              <button style={styles.generateBtn(false)} onClick={() => setTab("generate")}>
                ✨ إنشاء حملة جديدة
              </button>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>🎯 آخر الحملات</div>
              {campaigns.slice(0, 4).map((c, i) => (
                <div key={i} style={styles.campItem}>
                  <div style={styles.campIcon(c.bg)}>{c.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.campName}>{c.name}</div>
                    <div style={styles.campMeta}>{c.meta}</div>
                  </div>
                  <div style={styles.statusBadge(c.status)}>
                    {c.status === "active" ? "نشطة" : c.status === "paused" ? "متوقفة" : "مسودة"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* GENERATE */}
        {tab === "generate" && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              🤖 مولّد الحملات
              <span style={styles.aiBadge}>AI</span>
            </div>

            <label style={styles.label}>المنتج أو الخدمة *</label>
            <input style={styles.input} value={product} onChange={e => setProduct(e.target.value)} placeholder="مثال: تطبيق توصيل طعام..." />

            <label style={styles.label}>الهدف من الحملة</label>
            <input style={styles.input} value={goal} onChange={e => setGoal(e.target.value)} placeholder="مثال: زيادة المبيعات..." />

            <label style={styles.label}>الجمهور المستهدف</label>
            <input style={styles.input} value={audience} onChange={e => setAudience(e.target.value)} placeholder="مثال: شباب 18-35..." />

            <label style={styles.label}>الميزانية</label>
            <input style={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="مثال: 5,000 ريال" />

            <label style={styles.label}>نبرة الحملة</label>
            <div style={styles.chipsRow}>
              {TONES.map(t => (
                <button key={t} style={styles.chip(tone === t, "#ff6b35")} onClick={() => setTone(t)}>{t}</button>
              ))}
            </div>

            <label style={styles.label}>المنصات</label>
            <div style={styles.chipsRow}>
              {PLATFORMS.map(p => (
                <button key={p} style={styles.chip(platforms.includes(p))} onClick={() => toggleArr(platforms, setPlatforms, p)}>{p}</button>
              ))}
            </div>

            <label style={styles.label}>ما تريد توليده</label>
            <div style={styles.chipsRow}>
              {TYPES.map(t => (
                <button key={t} style={styles.chip(types.includes(t), "#7c3aed")} onClick={() => toggleArr(types, setTypes, t)}>{t}</button>
              ))}
            </div>

            <button style={styles.generateBtn(loading)} onClick={generate} disabled={loading}>
              {loading ? "⏳ الذكاء الاصطناعي يبتكر حملتك..." : "✨ توليد الحملة بالذكاء الاصطناعي"}
            </button>

            {output && (
              <div style={styles.outputBox}>
                <div style={styles.outputHeader}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff" }} />
                  نتائج الذكاء الاصطناعي
                </div>
                <div style={styles.outputText}>{output}</div>
                <div style={styles.actionRow}>
                  <button style={styles.btnSmall("accent")} onClick={copyOutput}>
                    {copied ? "✅ تم النسخ" : "📋 نسخ"}
                  </button>
                  <button style={styles.btnSmall("ghost")} onClick={generate}>🔄 إعادة</button>
                  <button style={styles.btnSmall("primary")} onClick={saveCampaign}>
                    {saved ? "✅ تم الحفظ" : "💾 حفظ"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CAMPAIGNS */}
        {tab === "campaigns" && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎯 جميع الحملات ({campaigns.length})</div>
            {campaigns.map((c, i) => (
              <div key={i} style={styles.campItem}>
                <div style={styles.campIcon(c.bg)}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.campName}>{c.name}</div>
                  <div style={styles.campMeta}>{c.meta}</div>
                </div>
                <div style={styles.statusBadge(c.status)}>
                  {c.status === "active" ? "نشطة" : c.status === "paused" ? "متوقفة" : "مسودة"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INSIGHTS */}
        {tab === "insights" && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>💡 توصيات الذكاء الاصطناعي</div>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{ ...styles.insightItem, borderBottom: i === INSIGHTS.length - 1 ? "none" : "1px solid #1e2d47" }}>
                <div style={styles.dot(ins.color)} />
                <div style={styles.insightText}>{ins.text}</div>
                <div style={{ ...styles.insightVal, color: ins.valColor }}>{ins.val}</div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: 14, background: "rgba(0,212,255,0.05)", borderRadius: 12, border: "1px solid rgba(0,212,255,0.15)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📊 ملخص الأداء</div>
              <div style={{ fontSize: 12, color: "#6b8aad", lineHeight: 1.8 }}>
                حملاتك تحقق أداءً جيداً هذا الأسبوع.<br />
                أفضل حملة: <span style={{ color: "#00d4ff" }}>أحذية رياضية</span><br />
                معدل التحويل الأعلى: <span style={{ color: "#10b981" }}>4.8%</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
