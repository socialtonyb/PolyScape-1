import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, Trophy, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { OsrsButton } from "@/components/OsrsButton";
import { levelForXp } from "@shared/xp";
import { cn } from "@/lib/utils";

const PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;
const METRICS = [
  { value: "gp_profit", label: "GP Profit" },
  { value: "correct_predictions", label: "Correct Predictions" },
  { value: "xp_gained", label: "XP Gained" },
] as const;

const SKILLS = [
  { value: "overall", label: "Overall" },
  { value: "augury", label: "Augury" },
  { value: "scrying", label: "Scrying" },
  { value: "merchanting", label: "Merchanting" },
  { value: "wardcraft", label: "Wardcraft" },
  { value: "tickcraft", label: "Tickcraft" },
  { value: "wanderer", label: "Wanderer" },
  { value: "fashioncraft", label: "Fashioncraft" },
  { value: "slayers_focus", label: "Slayer's Focus" },
] as const;

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[#ffd700] font-display text-sm" data-testid={`rank-${rank}`}>1</span>;
  if (rank === 2) return <span className="text-[#c0c0c0] font-display text-sm" data-testid={`rank-${rank}`}>2</span>;
  if (rank === 3) return <span className="text-[#cd7f32] font-display text-sm" data-testid={`rank-${rank}`}>3</span>;
  return <span className="text-[#d6c3a1] font-body text-lg" data-testid={`rank-${rank}`}>{rank}</span>;
}

function LeaderboardTab() {
  const [period, setPeriod] = useState<string>("weekly");
  const [metric, setMetric] = useState<string>("gp_profit");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [period, metric, debouncedSearch]);

  const { data, isLoading } = useQuery<any>({
    queryKey: [`/api/hiscores/leaderboard?period=${period}&metric=${metric}&page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`],
  });

  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" data-testid="period-selector">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-2 font-display text-xs uppercase tracking-wider border-2 transition-colors",
                period === p
                  ? "bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]"
                  : "bg-black/20 border-[#5b4c39] text-[#d6c3a1] hover:border-[#ffd700]/50 hover:text-[#ffd700]"
              )}
              data-testid={`period-${p}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" data-testid="metric-selector">
          {METRICS.map((m) => (
            <button
              key={m.value}
              onClick={() => setMetric(m.value)}
              className={cn(
                "px-4 py-2 font-display text-xs uppercase tracking-wider border-2 transition-colors",
                metric === m.value
                  ? "bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]"
                  : "bg-black/20 border-[#5b4c39] text-[#d6c3a1] hover:border-[#ffd700]/50 hover:text-[#ffd700]"
              )}
              data-testid={`metric-${m.value}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b4c39]" />
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-[#5b4c39] text-[#d6c3a1] font-body text-lg placeholder-[#5b4c39] focus:outline-none focus:border-[#ffd700]/50"
            data-testid="input-leaderboard-search"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#ffd700] animate-spin" data-testid="loader-leaderboard" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 osrs-panel bg-[#2b231a]" data-testid="empty-leaderboard">
          <Trophy className="w-12 h-12 text-[#5b4c39] mx-auto mb-4" />
          <p className="text-[#d6c3a1] font-body text-lg">No players found for this period.</p>
        </div>
      ) : (
        <div className="osrs-panel bg-[#2b231a] overflow-x-auto">
          <table className="w-full" data-testid="leaderboard-table">
            <thead>
              <tr className="border-b-2 border-[#5b4c39]">
                <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Player Name</th>
                <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">GP Profit</th>
                <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">Correct</th>
                <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">XP Gained</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, idx: number) => {
                const rank = (page - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={row.userId}
                    className={cn(
                      "border-b border-[#5b4c39]/30 transition-colors hover:bg-[#ffd700]/5",
                      idx % 2 === 1 && "bg-black/10"
                    )}
                    data-testid={`leaderboard-row-${rank}`}
                  >
                    <td className="px-4 py-3 w-16 text-center">
                      <RankBadge rank={rank} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/hiscores/user/${row.username}`}
                        className="text-[#d6c3a1] font-body text-lg hover:text-[#ffd700] transition-colors"
                        data-testid={`link-player-${row.username}`}
                      >
                        {row.username}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[#00ff00] font-body text-lg" data-testid={`text-gp-${row.username}`}>
                        {(row.gpProfitTrading || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[#d6c3a1] font-body text-lg" data-testid={`text-correct-${row.username}`}>
                        {(row.predictionsCorrect || 0).toLocaleString()} / {(row.predictionsTotal || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan-400 font-body text-lg" data-testid={`text-xp-${row.username}`}>
                        {(row.xpGainedTotal || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4" data-testid="pagination-leaderboard">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 border-2 border-[#5b4c39] text-[#d6c3a1] disabled:opacity-30 hover:border-[#ffd700]/50 transition-colors"
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-body text-lg text-[#d6c3a1]" data-testid="text-page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 border-2 border-[#5b4c39] text-[#d6c3a1] disabled:opacity-30 hover:border-[#ffd700]/50 transition-colors"
            data-testid="button-next-page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

function SkillsTab() {
  const [skill, setSkill] = useState<string>("overall");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [skill, debouncedSearch]);

  const { data, isLoading } = useQuery<any>({
    queryKey: [`/api/hiscores/skills?skill=${skill}&page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`],
  });

  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" data-testid="skill-selector">
          {SKILLS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSkill(s.value)}
              className={cn(
                "px-3 py-2 font-display text-xs uppercase tracking-wider border-2 transition-colors",
                skill === s.value
                  ? "bg-[#ffd700]/20 border-[#ffd700] text-[#ffd700]"
                  : "bg-black/20 border-[#5b4c39] text-[#d6c3a1] hover:border-[#ffd700]/50 hover:text-[#ffd700]"
              )}
              data-testid={`skill-${s.value}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5b4c39]" />
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border-2 border-[#5b4c39] text-[#d6c3a1] font-body text-lg placeholder-[#5b4c39] focus:outline-none focus:border-[#ffd700]/50"
            data-testid="input-skills-search"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#ffd700] animate-spin" data-testid="loader-skills" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 osrs-panel bg-[#2b231a]" data-testid="empty-skills">
          <Trophy className="w-12 h-12 text-[#5b4c39] mx-auto mb-4" />
          <p className="text-[#d6c3a1] font-body text-lg">No players found.</p>
        </div>
      ) : (
        <div className="osrs-panel bg-[#2b231a] overflow-x-auto">
          <table className="w-full" data-testid="skills-table">
            <thead>
              <tr className="border-b-2 border-[#5b4c39]">
                <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Player Name</th>
                <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">XP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, idx: number) => {
                const rank = (page - 1) * pageSize + idx + 1;
                const xp = skill === "overall" ? (row.totalXp || 0) : (row.xp || 0);
                const level = levelForXp(xp);
                return (
                  <tr
                    key={row.userId}
                    className={cn(
                      "border-b border-[#5b4c39]/30 transition-colors hover:bg-[#ffd700]/5",
                      idx % 2 === 1 && "bg-black/10"
                    )}
                    data-testid={`skills-row-${rank}`}
                  >
                    <td className="px-4 py-3 w-16 text-center">
                      <RankBadge rank={rank} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/hiscores/user/${row.username}`}
                        className="text-[#d6c3a1] font-body text-lg hover:text-[#ffd700] transition-colors"
                        data-testid={`link-skill-player-${row.username}`}
                      >
                        {row.username}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[#00ff00] font-display text-sm" data-testid={`text-level-${row.username}`}>
                        {level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan-400 font-body text-lg" data-testid={`text-skill-xp-${row.username}`}>
                        {xp.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4" data-testid="pagination-skills">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 border-2 border-[#5b4c39] text-[#d6c3a1] disabled:opacity-30 hover:border-[#ffd700]/50 transition-colors"
            data-testid="button-skills-prev-page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-body text-lg text-[#d6c3a1]" data-testid="text-skills-page-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 border-2 border-[#5b4c39] text-[#d6c3a1] disabled:opacity-30 hover:border-[#ffd700]/50 transition-colors"
            data-testid="button-skills-next-page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Hiscores() {
  const [tab, setTab] = useState<"leaderboard" | "skills">("leaderboard");

  return (
    <div className="container mx-auto px-4 py-8 pb-24 space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-[#2b231a] rounded border-2 border-[#5b4c39]">
          <Trophy className="w-10 h-10 text-[#ffd700]" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#ffd700]" data-testid="text-hiscores-title">
            Hiscores
          </h1>
          <p className="text-[#d6c3a1] font-body text-lg" data-testid="text-hiscores-subtitle">
            The greatest adventurers of Gielinor
          </p>
        </div>
      </div>

      <div className="flex gap-2" data-testid="tab-selector">
        <button
          onClick={() => setTab("leaderboard")}
          className={cn(
            "px-6 py-3 font-display text-sm uppercase tracking-wider border-b-4 transition-colors",
            tab === "leaderboard"
              ? "border-[#ffd700] text-[#ffd700] bg-[#ffd700]/10"
              : "border-transparent text-[#d6c3a1] hover:text-[#ffd700] hover:border-[#ffd700]/30"
          )}
          data-testid="tab-leaderboard"
        >
          Leaderboard
        </button>
        <button
          onClick={() => setTab("skills")}
          className={cn(
            "px-6 py-3 font-display text-sm uppercase tracking-wider border-b-4 transition-colors",
            tab === "skills"
              ? "border-[#ffd700] text-[#ffd700] bg-[#ffd700]/10"
              : "border-transparent text-[#d6c3a1] hover:text-[#ffd700] hover:border-[#ffd700]/30"
          )}
          data-testid="tab-skills"
        >
          Skills
        </button>
      </div>

      {tab === "leaderboard" ? <LeaderboardTab /> : <SkillsTab />}
    </div>
  );
}
