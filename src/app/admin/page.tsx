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
} from "@heroicons/react/24/outline";
import { useI18n } from "@/lib/i18n/I18nProvider";
import ThemeToggle from "../components/ThemeToggle";
import LanguageToggle from "../components/LanguageToggle";
import { appearEasing } from "../components/animations";

type Status = "new" | "contacted" | "done";

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

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
      </div>
    </section>
  );
}
