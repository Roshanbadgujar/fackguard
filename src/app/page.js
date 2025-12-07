"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LABEL_COLORS = {
  FAKE: "bg-red-500/20 text-red-300 border-red-500/50",
  SUSPECT: "bg-yellow-500/10 text-yellow-200 border-yellow-500/40",
  LIKELY_REAL: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

export default function Home() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [useAi, setUseAi] = useState(true); // default ON

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (!res.ok) {
        const text = await res.text();
        console.error("History API error:", res.status, text);
        // error pe history ko empty array hi rakho
        setHistory([]);
        return;
      }

      const data = await res.json();

      // agar kisi wajah se array nahi hai, to crash avoid karo
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        console.warn("History API did not return an array:", data);
        setHistory([]);
      }
    } catch (e) {
      console.error("History fetch failed:", e);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (mode === "text" && !text.trim()) {
      setError("Please paste some news text.");
      return;
    }
    if (mode === "url" && !url.trim()) {
      setError("Please paste an article URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          text: mode === "text" ? text : undefined,
          url: mode === "url" ? url : undefined,
          useAi,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Something went wrong.");
      } else {
        setResult(data);
        fetchHistory();
      }
    } catch (e) {
      console.error(e);
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col">
      {/* Top navbar */}
      <header className="w-full px-6 sm:px-10 py-4 flex items-center justify-between backdrop-blur bg-slate-900/40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-400/60 flex items-center justify-center text-xs font-semibold tracking-widest">
            FG
          </div>
          <div>
            <p className="font-semibold tracking-tight">FactGuard</p>
            <p className="text-xs text-slate-400 -mt-0.5">
              Mini Fake News Detector
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-slate-900/50">
            Built with Next.js · MongoDB
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row px-6 sm:px-10 py-8 gap-8">
        {/* Left side info */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:w-5/12 flex flex-col justify-center gap-6"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Detect{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                Fake News
              </span>{" "}
              in seconds.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl">
              Paste any headline, story or link. FactGuard will quickly score
              how suspicious it looks using heuristic checks on language,
              structure and source.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
            {[
              {
                title: "Heuristic scoring",
                desc: "Checks clickbait tone, all caps & more.",
              },
              {
                title: "Source awareness",
                desc: "Understands trusted vs sus domains.",
              },
              {
                title: "Mini project ready",
                desc: "Clean code, API + DB + UI.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl border border-white/10 bg-white/5/10 bg-gradient-to-br from-slate-900/60 to-slate-800/40 px-3 py-3"
              >
                <p className="text-xs font-semibold text-slate-100">
                  {item.title}
                </p>
                <p className="text-[11px] mt-1 text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Right side analyzer card */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:w-7/12 flex flex-col gap-6"
        >
          <motion.div
            layout
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-indigo-900/40 backdrop-blur-xl p-5 sm:p-6 shadow-2xl"
          >
            {/* tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex p-1 rounded-full bg-slate-900/80 border border-white/10">
                <button
                  onClick={() => setMode("text")}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition ${
                    mode === "text"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-300"
                  }`}
                >
                  Text Mode
                </button>
                <button
                  onClick={() => setMode("url")}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition ${
                    mode === "url"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-300"
                  }`}
                >
                  URL Mode
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  AI (Gemini) checker
                </span>
                <button
                  type="button"
                  onClick={() => setUseAi((v) => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full border border-white/15 transition ${
                    useAi ? "bg-emerald-500/70" : "bg-slate-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      useAi ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* inputs */}
            <AnimatePresence mode="wait">
              {mode === "text" ? (
                <motion.div
                  key="text-mode"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-xs font-medium text-slate-200">
                    Paste news text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    className="mt-2 w-full rounded-2xl bg-slate-950/60 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent resize-none"
                    placeholder="Example: Government has secretly banned all cash from tomorrow, says viral WhatsApp message..."
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="url-mode"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-xs font-medium text-slate-200">
                    Paste article URL
                  </label>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-2 w-full rounded-2xl bg-slate-950/60 border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent"
                    placeholder="https://example-news.com/article/123"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    We only analyse domain patterns, we don&apos;t fetch the
                    actual article.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* error */}
            {error && (
              <p className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {/* button */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-xs sm:text-sm font-medium shadow-lg shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && (
                  <motion.span
                    className="h-3 w-3 rounded-full border-[2px] border-white/60 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.7,
                      ease: "linear",
                    }}
                  />
                )}
                <span>{loading ? "Analyzing..." : "Analyze Now"}</span>
              </motion.button>

              <p className="text-[11px] text-slate-400">
                This tool is assistive, not a final truth checker.
              </p>
            </div>

            {/* result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  key="result-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] border ${
                        LABEL_COLORS[result.label]
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {result.label.replace("_", " ")}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(result.createdAt)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                        Fake score
                      </p>
                      <p className="text-3xl font-semibold">
                        {result.score}
                        <span className="text-sm text-slate-400"> / 100</span>
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <p>
                        0 = real-ish, 100 = very fake-looking (heuristically).
                      </p>
                    </div>
                  </div>

                  {!!result.reasons?.length && (
                    <div className="mt-3">
                      <p className="text-[11px] font-medium text-slate-300 mb-1">
                        Why this score?
                      </p>
                      <ul className="space-y-1.5 text-[11px] text-slate-300">
                        {result.reasons.map((r, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="mt-1 h-1 w-1 rounded-full bg-slate-400" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-200">
                Recent analyses
              </p>
              <span className="text-[11px] text-slate-500">
                Last {history.length || 0} entries
              </span>
            </div>
            {Array.isArray(history) && history.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                You haven&apos;t analysed anything yet.
              </p>
            ) : (
              Array.isArray(history) && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      className="min-w-[180px] max-w-[230px] rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] border ${
                            LABEL_COLORS[item.label]
                          }`}
                        >
                          {item.label.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-3">
                        {item.inputType === "text" ? item.text : item.url}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </motion.section>
      </main>

      <footer className="px-6 sm:px-10 py-3 text-[11px] text-slate-500 border-t border-white/5 bg-slate-950/70">
        <span>
          FactGuard · Mini project demo · Replace heuristic logic or add ML
          model later if needed.
        </span>
      </footer>
    </div>
  );
}
