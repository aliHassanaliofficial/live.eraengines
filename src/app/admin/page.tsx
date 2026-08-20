"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  TrashIcon,
  LockClosedIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { appearEasing } from "../components/animations";

type Status = "new" | "contacted" | "done";
type AdminTab = "consultations" | "branding" | "social";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  preferred_date: string | null;
  created_at: string;
}

interface BrandingLogo {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  sort_order: number;
  created_at: string;
}

const STATUS_ORDER: Status[] = ["new", "contacted", "done"];

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  contacted: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

function formatDate(value: string, lang: "en" | "ar"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminPage() {
  const { t, lang } = useI18n();

  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "error">("idle");
  const [logoutMsg, setLogoutMsg] = useState("");

  const [data, setData] = useState<Consultation[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("consultations");

  const [brandingLogos, setBrandingLogos] = useState<BrandingLogo[] | null>(null);
  const [brandingError, setBrandingError] = useState("");
  const [brandingCategoryFilter, setBrandingCategoryFilter] = useState<string>("all");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deletingLogoId, setDeletingLogoId] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState<SocialLink[] | null>(null);
  const [socialError, setSocialError] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [socialLabel, setSocialLabel] = useState("");
  const [socialSaving, setSocialSaving] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [deletingSocialId, setDeletingSocialId] = useState<string | null>(null);

  const searchRef = useRef<string>("");
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/consultations", { method: "GET" });
      if (res.ok) {
        setAuthed(true);
        return true;
      }
      setAuthed(false);
      return false;
    } catch {
      setAuthed(false);
      return false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    // Fetch-on-mount session check: setState runs only in the async callback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    verifySession().then((ok) => {
      if (!active) return;
      setChecking(false);
      if (!ok) setAuthed(false);
    });
    return () => {
      active = false;
    };
  }, [verifySession]);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (searchRef.current.trim()) params.set("search", searchRef.current.trim());
      const res = await fetch(`/api/admin/consultations?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to load requests.");
        return;
      }
      const body = (await res.json()) as { data: Consultation[] };
      setError("");
      setData(body.data);
    } catch {
      setError("Failed to load requests.");
    }
  }, [filter]);

  useEffect(() => {
    if (!authed) return;
    // Data fetching on mount / filter change: all setState happens after await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [authed, filter, load]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => {
      searchRef.current = value;
      load();
    }, 400);
  };

  const counts = useMemo(() => {
    const map: Record<Status, number> = { new: 0, contacted: 0, done: 0 };
    for (const row of data ?? []) {
      if (row.status in map) map[row.status as Status] += 1;
    }
    return map;
  }, [data]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoginStatus("loading");
    setLogoutMsg("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        setPassword("");
        setLoginStatus("idle");
      } else {
        setLoginStatus("error");
      }
    } catch {
      setLoginStatus("error");
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAuthed(false);
    setLogoutMsg(t.admin.signedOut);
    setData([]);
    setExpanded(null);
  }

  async function changeStatus(id: string, status: Status) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to update status.");
        return;
      }
      setData((prev) =>
        (prev ?? []).map((row) => (row.id === id ? { ...row, status } : row))
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t.admin.deleteConfirm)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/consultations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to delete.");
        return;
      }
      setData((prev) => (prev ?? []).filter((row) => row.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      setError("Failed to delete.");
    } finally {
      setBusyId(null);
    }
  }

  async function loadBranding() {
    try {
      const res = await fetch("/api/admin/branding", { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setBrandingError(body.error || "Failed to load logos.");
        return;
      }
      const body = (await res.json()) as { data: BrandingLogo[] };
      setBrandingError("");
      setBrandingLogos(body.data);
    } catch {
      setBrandingError("Failed to load logos.");
    }
  }

  useEffect(() => {
    if (authed && activeTab === "branding") {
      loadBranding();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [authed, activeTab]);

  async function handleUploadLogo(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim() || !uploadCategory.trim()) return;
    setUploading(true);
    setUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle.trim());
      formData.append("category", uploadCategory.trim());
      const res = await fetch("/api/admin/branding", {
        method: "POST",
        body: formData,
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setUploadMsg({ type: "err", text: body.error || t.branding.uploadError });
        return;
      }
      setUploadMsg({ type: "ok", text: t.branding.uploadSuccess });
      setUploadTitle("");
      setUploadCategory("");
      setUploadFile(null);
      loadBranding();
    } catch {
      setUploadMsg({ type: "err", text: t.branding.uploadError });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteLogo(id: string) {
    if (!window.confirm(t.branding.deleteConfirm)) return;
    setDeletingLogoId(id);
    setBrandingError("");
    try {
      const res = await fetch(`/api/admin/branding?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setBrandingError(body.error || "Failed to delete.");
        return;
      }
      setBrandingLogos((prev) => (prev ?? []).filter((l) => l.id !== id));
    } catch {
      setBrandingError("Failed to delete.");
    } finally {
      setDeletingLogoId(null);
    }
  }

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const logo of brandingLogos ?? []) cats.add(logo.category);
    return Array.from(cats).sort();
  }, [brandingLogos]);

  const filteredLogos = useMemo(() => {
    const list = brandingLogos ?? [];
    if (brandingCategoryFilter === "all") return list;
    return list.filter((l) => l.category === brandingCategoryFilter);
  }, [brandingLogos, brandingCategoryFilter]);

  async function loadSocialLinks() {
    try {
      const res = await fetch("/api/admin/social-links", { cache: "no-store" });
      if (res.status === 401) { setAuthed(false); return; }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSocialError(body.error || "Failed to load social links.");
        return;
      }
      const body = (await res.json()) as { data: SocialLink[] };
      setSocialError("");
      setSocialLinks(body.data);
    } catch {
      setSocialError("Failed to load social links.");
    }
  }

  useEffect(() => {
    if (authed && activeTab === "social") {
      loadSocialLinks();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [authed, activeTab]);

  async function handleSaveSocial(e: React.FormEvent) {
    e.preventDefault();
    if (!socialPlatform.trim() || !socialUrl.trim()) return;
    setSocialSaving(true);
    try {
      if (editingSocialId) {
        const res = await fetch("/api/admin/social-links", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSocialId, platform: socialPlatform, url: socialUrl, label: socialLabel }),
        });
        if (res.status === 401) { setAuthed(false); return; }
        if (!res.ok) { setSocialError(t.socialLinks.error); return; }
        const body = (await res.json()) as { data: SocialLink };
        setSocialLinks((prev) => (prev ?? []).map((l) => l.id === editingSocialId ? body.data : l));
      } else {
        const res = await fetch("/api/admin/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform: socialPlatform, url: socialUrl, label: socialLabel, sort_order: (socialLinks?.length ?? 0) }),
        });
        if (res.status === 401) { setAuthed(false); return; }
        if (!res.ok) { setSocialError(t.socialLinks.error); return; }
        const body = (await res.json()) as { data: SocialLink };
        setSocialLinks((prev) => [...(prev ?? []), body.data]);
      }
      setSocialPlatform("");
      setSocialUrl("");
      setSocialLabel("");
      setEditingSocialId(null);
      setSocialError("");
    } catch {
      setSocialError(t.socialLinks.error);
    } finally {
      setSocialSaving(false);
    }
  }

  async function handleDeleteSocial(id: string) {
    if (!window.confirm(t.socialLinks.deleteConfirm)) return;
    setDeletingSocialId(id);
    setSocialError("");
    try {
      const res = await fetch(`/api/admin/social-links?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.status === 401) { setAuthed(false); return; }
      if (!res.ok) { setSocialError("Failed to delete."); return; }
      setSocialLinks((prev) => (prev ?? []).filter((l) => l.id !== id));
      if (editingSocialId === id) {
        setEditingSocialId(null);
        setSocialPlatform("");
        setSocialUrl("");
        setSocialLabel("");
      }
    } catch {
      setSocialError("Failed to delete.");
    } finally {
      setDeletingSocialId(null);
    }
  }

  const statCards: { label: string; value: number; filter: Status | "all" }[] = [
    { label: t.admin.total, value: data?.length ?? 0, filter: "all" },
    { label: t.admin.new, value: counts.new, filter: "new" },
    { label: t.admin.contacted, value: counts.contacted, filter: "contacted" },
    { label: t.admin.done, value: counts.done, filter: "done" },
  ];

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-glass border-t-accent" />
      </div>
    );
  }

  if (!authed) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "-10%", insetInlineStart: "-8%", width: 340, height: 340 }} />
        <div className="orb animate-drift bg-[var(--orb-b)]" style={{ bottom: "-12%", insetInlineEnd: "-8%", width: 320, height: 320, animationDelay: "-8s" }} />

        <motion.div
          initial={{ opacity: 0.001, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: appearEasing }}
          className="relative w-full max-w-md"
        >
          <div className="absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-tr from-[var(--orb-a)] via-[var(--orb-b)] to-[var(--orb-c)] blur-2xl opacity-40" />
          <div className="glass-strong rounded-[28px] p-8 sm:p-10">
            <div className="mb-2 flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                <LockClosedIcon className="h-6 w-6" />
              </span>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-ink">{t.admin.loginTitle}</h1>
            <p className="mt-1 text-sm text-muted">{t.admin.loginSubtitle}</p>

            <form onSubmit={handleLogin} className="mt-8">
              {logoutMsg && (
                <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                  {logoutMsg}
                </p>
              )}
              {loginStatus === "error" && (
                <p className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {t.admin.invalidPassword}
                </p>
              )}
              <label className="mb-1.5 block text-xs font-semibold text-muted">
                {t.admin.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.admin.passwordPlaceholder}
                autoComplete="current-password"
                className="w-full rounded-xl border border-border-glass bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="submit"
                disabled={loginStatus === "loading" || !password.trim()}
                className="mt-5 w-full rounded-full py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                  boxShadow: "0 12px 30px -10px var(--accent)",
                }}
              >
                {loginStatus === "loading" ? t.admin.loggingIn : t.admin.login}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-8">
      <div className="orb animate-drift bg-[var(--orb-a)]" style={{ top: "-12%", insetInlineEnd: "-10%", width: 360, height: 360 }} />
      <div className="orb animate-drift bg-[var(--orb-b)]" style={{ bottom: "-15%", insetInlineStart: "-10%", width: 340, height: 340, animationDelay: "-8s" }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t.admin.dashboard}</h1>
            <p className="mt-1 text-sm text-muted">{t.contact.subtitle}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full glass glass-hover px-4 py-2 text-xs font-semibold text-ink"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              {t.admin.logout}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("consultations")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "consultations" ? "text-white" : "glass glass-hover text-ink"
            }`}
            style={
              activeTab === "consultations"
                ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                : undefined
            }
          >
            {t.admin.consultationsTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("branding")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "branding" ? "text-white" : "glass glass-hover text-ink"
            }`}
            style={
              activeTab === "branding"
                ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                : undefined
            }
          >
            <PhotoIcon className="h-4 w-4" />
            {t.admin.brandingTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "social" ? "text-white" : "glass glass-hover text-ink"
            }`}
            style={
              activeTab === "social"
                ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                : undefined
            }
          >
            <GlobeAltIcon className="h-4 w-4" />
            {t.socialLinks.title}
          </button>
        </div>

        {activeTab === "consultations" ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map((card) => (
                <button
                  key={card.label}
                  type="button"
                  onClick={() => setFilter(card.filter)}
                  className={`rounded-[20px] p-5 text-start transition-all ${
                    filter === card.filter
                      ? "glass-strong ring-2 ring-accent/50"
                      : "glass glass-hover"
                  }`}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {card.label}
                  </div>
                  <div className="mt-1 text-3xl font-bold text-ink">{card.value}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t.admin.search}
                  className="w-full rounded-full border border-border-glass bg-surface py-3 ps-10 pe-4 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <div className="flex items-center gap-2">
                {["all", ...STATUS_ORDER].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status as Status | "all")}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      filter === status
                        ? "text-white"
                        : "glass glass-hover text-ink"
                    }`}
                    style={
                      filter === status
                        ? {
                            backgroundImage:
                              "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                          }
                        : undefined
                    }
                  >
                    {status === "all" ? t.admin.all : t.admin[status as Status]}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 space-y-3">
              {data === null ? (
                <div className="flex justify-center py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-glass border-t-accent" />
                </div>
              ) : data.length === 0 ? (
                <div className="glass rounded-[24px] py-16 text-center">
                  <p className="text-sm text-muted">{t.admin.noResults}</p>
                </div>
              ) : (
                data.map((row, index) => {
                  const open = expanded === row.id;
                  const status = STATUS_ORDER.includes(row.status as Status)
                    ? (row.status as Status)
                    : "new";
                  return (
                    <motion.div
                      key={row.id}
                      initial={{ opacity: 0.001, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: appearEasing, delay: Math.min(index, 8) * 0.03 }}
                      className={`overflow-hidden rounded-[22px] transition-colors ${
                        open ? "glass-strong" : "glass glass-hover"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(open ? null : row.id)}
                        className="flex w-full cursor-pointer items-center gap-4 p-5 text-start"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-sm font-bold text-accent">
                          {row.name.trim().charAt(0).toUpperCase() || "?"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="truncate text-sm font-bold text-ink">{row.name}</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>
                              {t.admin[status]}
                            </span>
                          </div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-muted">
                            <span className="inline-flex items-center gap-1">
                              <EnvelopeIcon className="h-3.5 w-3.5" />
                              {row.email}
                            </span>
                            {row.phone && (
                              <span className="inline-flex items-center gap-1">
                                <PhoneIcon className="h-3.5 w-3.5" />
                                {row.phone}
                              </span>
                            )}
                            <span>{formatDate(row.created_at, lang)}</span>
                          </div>
                        </div>
                        {open ? (
                          <ChevronUpIcon className="h-5 w-5 shrink-0 text-muted" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 shrink-0 text-muted" />
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="grid gap-4 border-t border-border-glass px-5 pb-5 pt-4 sm:grid-cols-2">
                              {[
                                { label: t.admin.phone, value: row.phone },
                                { label: t.admin.company, value: row.company },
                                { label: t.admin.service, value: row.service },
                                { label: t.admin.budget, value: row.budget },
                                { label: t.admin.preferredDate, value: row.preferred_date },
                                { label: t.admin.date, value: formatDate(row.created_at, lang) },
                              ].map((item) => (
                                <div key={item.label}>
                                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                    {item.label}
                                  </div>
                                  <div className="mt-0.5 break-words text-sm font-medium text-ink">
                                    {item.value || "—"}
                                  </div>
                                </div>
                              ))}
                              <div className="sm:col-span-2">
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                                  {t.admin.message}
                                </div>
                                <p className="mt-0.5 whitespace-pre-wrap text-sm leading-[1.7] text-ink">
                                  {row.message || "—"}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-end justify-between gap-4 sm:col-span-2">
                                <div>
                                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted">
                                    {t.admin.status}
                                  </label>
                                  <div className="flex items-center gap-2">
                                    {STATUS_ORDER.map((s) => (
                                      <button
                                        key={s}
                                        type="button"
                                        disabled={busyId === row.id}
                                        onClick={() => changeStatus(row.id, s)}
                                        className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                                          status === s
                                            ? STATUS_STYLES[s]
                                            : "border-border-glass text-muted hover:text-ink"
                                        }`}
                                      >
                                        {t.admin[s]}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  disabled={busyId === row.id}
                                  onClick={() => handleDelete(row.id)}
                                  className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  {t.admin.delete}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>
          </>
        ) : activeTab === "branding" ? (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="glass-strong rounded-[24px] p-6">
                <h2 className="text-lg font-bold text-ink">{t.branding.uploadTitle}</h2>
                <form onSubmit={handleUploadLogo} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.branding.titleLabel}</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder={t.branding.titlePlaceholder}
                      className="w-full rounded-xl border border-border-glass bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.branding.categoryLabel}</label>
                    <input
                      type="text"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      placeholder={t.branding.categoryPlaceholder}
                      list="branding-categories"
                      className="w-full rounded-xl border border-border-glass bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                    />
                    <datalist id="branding-categories">
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.branding.fileLabel}</label>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const file = e.dataTransfer.files[0];
                        if (file) setUploadFile(file);
                      }}
                      onClick={() => document.getElementById("branding-file-input")?.click()}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                        dragOver
                          ? "border-accent bg-accent-soft"
                          : "border-border-glass bg-surface hover:border-accent/50"
                      }`}
                    >
                      {uploadFile ? (
                        <>
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(uploadFile)}
                              alt="Preview"
                              className="h-20 w-20 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setUploadFile(null); }}
                              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-xs text-muted">{uploadFile.name}</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="h-8 w-8 text-muted" />
                          <span className="text-sm text-ink">{t.branding.dragDrop}</span>
                          <span className="text-xs text-muted">{t.branding.dragDropHint}</span>
                        </>
                      )}
                    </div>
                    <input
                      id="branding-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadFile(file);
                      }}
                    />
                  </div>
                  {uploadMsg && (
                    <p className={`rounded-xl border px-4 py-3 text-sm ${
                      uploadMsg.type === "ok"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-red-400/40 bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}>
                      {uploadMsg.text}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile || !uploadTitle.trim() || !uploadCategory.trim()}
                    className="w-full rounded-full py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                      boxShadow: "0 12px 30px -10px var(--accent)",
                    }}
                  >
                    {uploading ? t.branding.uploading : t.branding.upload}
                  </button>
                </form>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setBrandingCategoryFilter("all")}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      brandingCategoryFilter === "all"
                        ? "text-white"
                        : "glass glass-hover text-ink"
                    }`}
                    style={
                      brandingCategoryFilter === "all"
                        ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                        : undefined
                    }
                  >
                    {t.branding.allCategories}
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBrandingCategoryFilter(cat)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                        brandingCategoryFilter === cat
                          ? "text-white"
                          : "glass glass-hover text-ink"
                      }`}
                      style={
                        brandingCategoryFilter === cat
                          ? { backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))" }
                          : undefined
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {brandingError && (
                  <p className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {brandingError}
                  </p>
                )}

                {brandingLogos === null ? (
                  <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-glass border-t-accent" />
                  </div>
                ) : filteredLogos.length === 0 ? (
                  <div className="glass rounded-[24px] py-16 text-center">
                    <p className="text-sm text-muted">{brandingCategoryFilter === "all" ? t.branding.noLogos : t.branding.noLogosCategory}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {filteredLogos.map((logo, index) => (
                      <motion.div
                        key={logo.id}
                        initial={{ opacity: 0.001, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: appearEasing, delay: Math.min(index, 8) * 0.03 }}
                        className="glass rounded-[20px] p-4"
                      >
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-white/50 p-3 dark:bg-white/5">
                          <img
                            src={logo.file_url}
                            alt={logo.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="mt-3">
                          <p className="truncate text-sm font-bold text-ink">{logo.title}</p>
                          <p className="mt-0.5 text-xs text-muted">{logo.category}</p>
                        </div>
                        <button
                          type="button"
                          disabled={deletingLogoId === logo.id}
                          onClick={() => handleDeleteLogo(logo.id)}
                          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          {t.branding.delete}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 max-w-2xl">
              <div className="glass-strong rounded-[24px] p-6">
                <h2 className="text-lg font-bold text-ink">{t.socialLinks.addTitle}</h2>
                <form onSubmit={handleSaveSocial} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.socialLinks.platformLabel}</label>
                    <input
                      type="text"
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      placeholder={t.socialLinks.platformPlaceholder}
                      className="w-full rounded-xl border border-border-glass bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.socialLinks.urlLabel}</label>
                    <input
                      type="url"
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      placeholder={t.socialLinks.urlPlaceholder}
                      className="w-full rounded-xl border border-border-glass bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-muted">{t.socialLinks.labelLabel}</label>
                    <input
                      type="text"
                      value={socialLabel}
                      onChange={(e) => setSocialLabel(e.target.value)}
                      placeholder={t.socialLinks.labelPlaceholder}
                      className="w-full rounded-xl border border-border-glass bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 transition focus:border-accent/70 focus:ring-2 focus:ring-accent/25"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={socialSaving || !socialPlatform.trim() || !socialUrl.trim()}
                      className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        backgroundImage: "linear-gradient(120deg, var(--accent), var(--accent-strong))",
                      }}
                    >
                      {editingSocialId ? t.socialLinks.save : t.socialLinks.add}
                    </button>
                    {editingSocialId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSocialId(null);
                          setSocialPlatform("");
                          setSocialUrl("");
                          setSocialLabel("");
                        }}
                        className="rounded-full glass glass-hover px-5 py-2.5 text-sm font-semibold text-ink"
                      >
                        {t.socialLinks.cancel}
                      </button>
                    )}
                  </div>
                </form>
                {socialError && (
                  <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {socialError}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {socialLinks === null ? (
                  <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-border-glass border-t-accent" />
                  </div>
                ) : socialLinks.length === 0 ? (
                  <div className="glass rounded-[24px] py-16 text-center">
                    <p className="text-sm text-muted">{t.socialLinks.noLinks}</p>
                  </div>
                ) : (
                  socialLinks.map((link, index) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0.001, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: appearEasing, delay: Math.min(index, 8) * 0.03 }}
                      className="glass rounded-[20px] p-5"
                    >
                      <div className="flex items-center gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-sm font-bold text-accent">
                          {link.platform.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-ink">{link.platform}</p>
                          <p className="truncate text-xs text-muted">{link.url}</p>
                          {link.label && <p className="text-xs text-muted/70">{link.label}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSocialId(link.id);
                              setSocialPlatform(link.platform);
                              setSocialUrl(link.url);
                              setSocialLabel(link.label || "");
                            }}
                            className="rounded-full glass glass-hover px-3 py-1.5 text-xs font-semibold text-ink"
                          >
                            {t.socialLinks.edit}
                          </button>
                          <button
                            type="button"
                            disabled={deletingSocialId === link.id}
                            onClick={() => handleDeleteSocial(link.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                            {t.socialLinks.delete}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
