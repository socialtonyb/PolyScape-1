import {
  useSkills,
  useUserMe,
  useUserStats,
  useDiary,
  useWeeklyContracts,
  usePickContract,
  useWardcheck,
} from "@/hooks/use-user-data";
import { useState } from "react";
import {
  Loader2,
  Eye,
  BarChart3,
  ShoppingCart,
  Shield,
  Clock,
  Sparkles,
  Paintbrush,
  Target,
  Swords,
  Trophy,
  Flame,
  CheckCircle2,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { xpProgress, SKILL_META, type SkillSlug } from "@shared/xp";

const SKILL_ICONS: Record<SkillSlug, React.ComponentType<{ className?: string }>> = {
  augury: Eye,
  scrying: BarChart3,
  merchanting: ShoppingCart,
  wardcraft: Shield,
  tickcraft: Clock,
  wanderer: Sparkles,
  fashioncraft: Paintbrush,
  slayers_focus: Target,
};

const SKILL_COLORS: Record<SkillSlug, string> = {
  augury: "text-cyan-400",
  scrying: "text-blue-400",
  merchanting: "text-green-400",
  wardcraft: "text-red-400",
  tickcraft: "text-yellow-400",
  wanderer: "text-purple-400",
  fashioncraft: "text-pink-400",
  slayers_focus: "text-orange-400",
};

const TIER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  EASY: { text: "text-green-400", bg: "bg-green-700", border: "border-green-600" },
  MEDIUM: { text: "text-blue-400", bg: "bg-blue-700", border: "border-blue-600" },
  HARD: { text: "text-red-400", bg: "bg-red-700", border: "border-red-600" },
  ELITE: { text: "text-purple-400", bg: "bg-purple-700", border: "border-purple-600" },
  GRANDMASTER: { text: "text-[#ffd700]", bg: "bg-yellow-700", border: "border-yellow-600" },
};

const TIER_ORDER = ["EASY", "MEDIUM", "HARD", "ELITE", "GRANDMASTER"];

const SKILL_SLUGS: SkillSlug[] = [
  "augury", "scrying", "merchanting", "wardcraft",
  "tickcraft", "wanderer", "fashioncraft", "slayers_focus",
];

function OsrsXpBar({ currentXp, slug }: { currentXp: number; slug: string }) {
  const { level, progress, remaining } = xpProgress(currentXp);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] mb-1">
        <span className="text-[#d6c3a1]/60">
          {level >= 99 ? "MAX LEVEL" : `${remaining.toLocaleString()} XP to next`}
        </span>
        <span className="text-[#d6c3a1]/40">{progress}%</span>
      </div>
      <div
        className="relative h-4 bg-[#1a1510] border-2 border-[#5b4c39] overflow-hidden"
        data-testid={`skill-xp-bar-${slug}`}
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-[#5b4c39]/30 last:border-r-0" />
          ))}
        </div>
        <div
          className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-400 transition-all duration-700 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  return (
    <div className="relative h-3 bg-[#1a1510] border border-[#5b4c39] overflow-hidden">
      <div
        className={cn("h-full transition-all duration-500", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SkillsGrid({ skillMap }: { skillMap: Map<string, any> }) {
  const [openSkills, setOpenSkills] = useState<Set<string>>(new Set());

  const toggleSkill = (slug: string) => {
    setOpenSkills((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-display text-[#ffd700] mb-4 flex items-center gap-2">
        <Swords className="w-5 h-5" />
        All Skills
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SKILL_SLUGS.map((slug) => {
          const sk = skillMap.get(slug);
          const xp = sk?.xp || 0;
          const { level } = xpProgress(xp);
          const Icon = SKILL_ICONS[slug];
          const meta = SKILL_META[slug];
          const color = SKILL_COLORS[slug];
          const isOpen = openSkills.has(slug);

          return (
            <div
              key={slug}
              className="osrs-panel bg-[#2b231a]"
              data-testid={`skill-card-${slug}`}
            >
              <button
                onClick={() => toggleSkill(slug)}
                className="w-full p-3 cursor-pointer select-none text-left"
                data-testid={`skill-toggle-${slug}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center border border-[#5b4c39] bg-black/30 rounded-sm shrink-0",
                      level > 1 && "border-[#ffd700]/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", color)} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3
                      className={cn("font-display text-[11px] leading-tight truncate", color)}
                      data-testid={`text-skill-name-${slug}`}
                    >
                      {meta.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="text-lg font-display text-white"
                      style={{ textShadow: "1px 1px 0px #000" }}
                      data-testid={`text-skill-level-${slug}`}
                    >
                      {level}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 text-[#d6c3a1]/50 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </div>

                <OsrsXpBar currentXp={xp} slug={slug} />
                <div className="mt-0.5 text-right">
                  <span
                    className="text-[9px] text-[#d6c3a1]/40 font-mono"
                    data-testid={`text-skill-xp-${slug}`}
                  >
                    {xp.toLocaleString()} XP
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3 border-t border-[#5b4c39]/40 pt-2">
                  <h4 className="text-[10px] font-display text-[#ffd700]/80 mb-1">
                    How to Train
                  </h4>
                  <ul className="space-y-0.5">
                    {meta.howToTrain.map((tip: string, i: number) => (
                      <li
                        key={i}
                        className="text-[10px] text-[#d6c3a1]/70 flex items-start gap-1"
                      >
                        <span className="text-[#ffd700]/50 mt-0.5 shrink-0">*</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiaryAccordion({ groupedDiary, diaryTasks }: { groupedDiary: Record<string, any[]>; diaryTasks: any[] }) {
  const [openTiers, setOpenTiers] = useState<Set<string>>(new Set());

  const toggleTier = (tier: string) => {
    setOpenTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-display text-[#ffd700] mb-4 flex items-center gap-2">
        <ScrollText className="w-5 h-5" />
        Combat Achievement Diary
      </h2>
      {TIER_ORDER.map((tier) => {
        const tasks = groupedDiary[tier];
        if (!tasks || tasks.length === 0) return null;
        const tc = TIER_COLORS[tier];
        const isOpen = openTiers.has(tier);
        const completedCount = tasks.filter((t: any) => t.completed || (t.currentProgress || 0) >= (t.requirement || 1)).length;
        const swordSrc =
          tier === "EASY"
            ? "/images/sword-easy.png"
            : tier === "MEDIUM"
              ? "/images/sword-medium.png"
              : tier === "HARD"
                ? "/images/sword-hard.png"
                : tier === "ELITE"
                  ? "/images/sword-elite.png"
                  : "/images/sword-grandmaster.png";

        return (
          <div key={tier} className="mb-3">
            <button
              onClick={() => toggleTier(tier)}
              className={cn(
                "w-full flex items-center gap-3 p-3 osrs-panel bg-[#2b231a] cursor-pointer select-none transition-colors",
                isOpen && "border-b-0"
              )}
              data-testid={`diary-tier-toggle-${tier.toLowerCase()}`}
            >
              <img
                src={swordSrc}
                alt={`${tier} tier`}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <Shield className={cn("w-5 h-5", tc.text)} />
              <span className={cn("font-display text-sm uppercase tracking-wider", tc.text)}>
                {tier}
              </span>
              <span className="text-[10px] text-[#d6c3a1]/50 font-body ml-1">
                {completedCount}/{tasks.length}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 ml-auto transition-transform duration-200",
                  tc.text,
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="space-y-3 pt-3 pb-1">
                {tasks.map((task: any) => {
                  const currentProgress = task.currentProgress || 0;
                  const requirement = task.requirement || 1;
                  const completed = task.completed || currentProgress >= requirement;

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "osrs-panel bg-[#2b231a] p-4",
                        completed && "opacity-70"
                      )}
                      data-testid={`diary-task-${task.id}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 border border-[#5b4c39] rounded-sm shrink-0" />
                          )}
                          <h4
                            className={cn(
                              "font-display text-sm",
                              completed ? "text-green-400 line-through" : "text-[#d6c3a1]"
                            )}
                            data-testid={`text-diary-title-${task.id}`}
                          >
                            {task.title}
                          </h4>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-display px-2 py-0.5 border rounded-sm",
                            tc.text,
                            tc.border
                          )}
                        >
                          {tier}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#d6c3a1]/70 mb-1">{task.description}</p>
                      <p className="text-[10px] text-[#d6c3a1]/50 italic mb-2">{task.howToDo}</p>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-[#d6c3a1]/60">
                            {currentProgress.toLocaleString()} / {requirement.toLocaleString()}
                          </span>
                          <span className="text-[#d6c3a1]/40">
                            {Math.min(100, Math.round((currentProgress / requirement) * 100))}%
                          </span>
                        </div>
                        <ProgressBar
                          current={currentProgress}
                          max={requirement}
                          color={completed ? "bg-green-500" : tc.bg}
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {(task.skillRewards || []).map((r: any, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] text-[#ffd700]/70 bg-[#ffd700]/10 px-1.5 py-0.5 rounded-sm"
                          >
                            +{r.xp.toLocaleString()} {r.skill} XP
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      {diaryTasks.length === 0 && (
        <div className="osrs-panel bg-[#2b231a] p-5 text-center">
          <p className="text-[#d6c3a1]/60 text-sm">
            Log in to view your achievement diary progress.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Skills() {
  const { data: skills, isLoading } = useSkills();
  const { data: user } = useUserMe();
  const { data: stats } = useUserStats();
  const { data: diary } = useDiary();
  const { data: contracts } = useWeeklyContracts();
  const pickContract = usePickContract();
  const wardcheck = useWardcheck();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  const skillMap = new Map((skills || []).map((s: any) => [s.skillSlug, s]));

  const totalLevel = SKILL_SLUGS.reduce((acc, slug) => {
    const sk = skillMap.get(slug);
    return acc + xpProgress(sk?.xp || 0).level;
  }, 0);

  const totalXp = SKILL_SLUGS.reduce((acc, slug) => {
    const sk = skillMap.get(slug);
    return acc + (sk?.xp || 0);
  }, 0);

  const diaryTasks = diary?.tasks || [];
  const groupedDiary: Record<string, any[]> = {};
  for (const tier of TIER_ORDER) {
    groupedDiary[tier] = diaryTasks.filter((t: any) => t.tier === tier);
  }

  const activeContract = contracts?.active || null;
  const availableContracts = contracts?.available || [];

  const currentStreak = stats?.currentWinStreak || 0;
  const bestStreak = stats?.bestWinStreak || 0;
  const streakMilestones = [3, 5, 10];

  const TASK_TIER_LABELS: Record<number, { label: string; text: string; border: string; bg: string }> = {
    1: { label: "Easy", text: "text-green-400", border: "border-green-600", bg: "bg-green-700" },
    2: { label: "Medium", text: "text-blue-400", border: "border-blue-600", bg: "bg-blue-700" },
    3: { label: "Hard", text: "text-red-400", border: "border-red-600", bg: "bg-red-700" },
  };

  const groupedContracts: Record<number, any[]> = { 1: [], 2: [], 3: [] };
  for (const c of availableContracts) {
    const tier = c.tier || 1;
    if (!groupedContracts[tier]) groupedContracts[tier] = [];
    groupedContracts[tier].push(c);
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-[#2b231a] rounded border-2 border-[#5b4c39]">
          <Target className="w-10 h-10 text-[#ffd700]" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#ffd700]" data-testid="text-skills-title">
            Skills
          </h1>
          <p className="text-[#d6c3a1] text-sm" data-testid="text-total-level">
            Total Level: {totalLevel} / {SKILL_SLUGS.length * 99}
          </p>
        </div>
      </div>

      {/* Stats boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="osrs-panel p-4 bg-[#2b231a]">
          <div className="text-xs font-display text-[#ffd700] mb-2">Total Level</div>
          <div
            className="text-4xl font-display text-white"
            style={{ textShadow: "2px 2px 0px #000" }}
            data-testid="text-total-level-value"
          >
            {totalLevel}
          </div>
        </div>
        <div className="osrs-panel p-4 bg-[#2b231a]">
          <div className="text-xs font-display text-[#ffd700] mb-2">Total XP</div>
          <div
            className="text-4xl font-display text-white"
            style={{ textShadow: "2px 2px 0px #000" }}
            data-testid="text-total-xp"
          >
            {totalXp.toLocaleString()}
          </div>
        </div>
        <div className="osrs-panel p-4 bg-[#2b231a]">
          <div className="text-xs font-display text-[#ffd700] mb-2">Skills</div>
          <div
            className="text-4xl font-display text-white"
            style={{ textShadow: "2px 2px 0px #000" }}
            data-testid="text-skill-count"
          >
            {SKILL_SLUGS.length}
          </div>
        </div>
      </div>

      {/* Slayer Task (formerly Weekly Contract) */}
      <div>
        <h2 className="text-xl font-display text-[#ffd700] mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Slayer Task
        </h2>
        <div className="osrs-panel bg-[#2b231a] p-5">
          {activeContract ? (
            <div data-testid="active-contract">
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm text-[#d6c3a1]" data-testid="text-contract-title">
                    {activeContract.title}
                  </h3>
                  {TASK_TIER_LABELS[activeContract.tier] && (
                    <span className={cn(
                      "text-[10px] font-display px-2 py-0.5 border rounded-sm",
                      TASK_TIER_LABELS[activeContract.tier].text,
                      TASK_TIER_LABELS[activeContract.tier].border
                    )}>
                      {TASK_TIER_LABELS[activeContract.tier].label}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#ffd700]/70 bg-[#ffd700]/10 px-2 py-0.5 rounded-sm">
                  +{(activeContract.xpReward || 0).toLocaleString()} XP
                </span>
              </div>
              <p className="text-[11px] text-[#d6c3a1]/70 mb-3">{activeContract.description}</p>
              <div className="mb-2">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-[#d6c3a1]/60">
                    {(activeContract.currentProgress || 0).toLocaleString()} /{" "}
                    {(activeContract.requirement || 0).toLocaleString()}
                  </span>
                  <span className="text-[#d6c3a1]/40">
                    {activeContract.requirement
                      ? Math.min(
                          100,
                          Math.round(
                            ((activeContract.currentProgress || 0) / activeContract.requirement) *
                              100
                          )
                        )
                      : 0}
                    %
                  </span>
                </div>
                <ProgressBar
                  current={activeContract.currentProgress || 0}
                  max={activeContract.requirement || 1}
                  color="bg-yellow-500"
                />
              </div>
            </div>
          ) : availableContracts.length > 0 ? (
            <div data-testid="available-contracts">
              <p className="text-[#d6c3a1]/70 text-sm mb-4">
                Choose a slayer task for bonus Slayer's Focus XP:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((tier) => {
                  const tierContracts = groupedContracts[tier] || [];
                  if (tierContracts.length === 0) return null;
                  const tl = TASK_TIER_LABELS[tier];
                  return (
                    <div key={tier} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-display text-xs uppercase tracking-wider", tl.text)}>
                          {tl.label}
                        </span>
                        <div className={cn("flex-grow h-px", tl.border, "border-t")} />
                      </div>
                      {tierContracts.map((c: any) => (
                        <div
                          key={c.id}
                          className="border border-[#5b4c39] p-3 bg-black/20"
                          data-testid={`contract-option-${c.id}`}
                        >
                          <h4 className="font-display text-sm text-[#d6c3a1] mb-1">{c.title}</h4>
                          <p className="text-[10px] text-[#d6c3a1]/60 mb-1">{c.description}</p>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] text-[#ffd700]/70">
                              +{(c.xpReward || 0).toLocaleString()} XP
                            </span>
                            <button
                              className="px-3 py-1 bg-[#5b4c39] border border-[#ffd700]/50 text-[#ffd700] font-display text-xs hover:bg-[#6b5c49] transition-colors shrink-0"
                              onClick={() => pickContract.mutate(c.id)}
                              disabled={pickContract.isPending}
                              data-testid={`button-pick-contract-${c.id}`}
                            >
                              {pickContract.isPending ? "..." : "Accept"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-[#d6c3a1]/60 text-sm" data-testid="text-no-contracts">
              No slayer tasks available. Log in or check back later.
            </p>
          )}
        </div>
      </div>

      {/* Task Streak (formerly Slayer's Focus Streaks) */}
      <div>
        <h2 className="text-xl font-display text-[#ffd700] mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Task Streak
        </h2>
        <div className="osrs-panel bg-[#2b231a] p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="text-center border border-[#5b4c39] p-3 bg-black/20">
              <div className="text-xs font-display text-[#ffd700] mb-1">Current Streak</div>
              <div
                className="text-3xl font-display text-white"
                style={{ textShadow: "1px 1px 0px #000" }}
                data-testid="text-current-streak"
              >
                {currentStreak}
              </div>
            </div>
            <div className="text-center border border-[#5b4c39] p-3 bg-black/20">
              <div className="text-xs font-display text-[#ffd700] mb-1">Best Streak</div>
              <div
                className="text-3xl font-display text-white"
                style={{ textShadow: "1px 1px 0px #000" }}
                data-testid="text-best-streak"
              >
                {bestStreak}
              </div>
            </div>
          </div>

          <h4 className="text-xs font-display text-[#ffd700]/80 mb-3">Milestones</h4>
          <div className="flex items-center gap-3 flex-wrap">
            {streakMilestones.map((m) => {
              const achieved = bestStreak >= m;
              return (
                <div
                  key={m}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-xs font-display",
                    achieved
                      ? "border-[#ffd700]/60 text-[#ffd700] bg-[#ffd700]/10"
                      : "border-[#5b4c39] text-[#d6c3a1]/40 bg-black/20"
                  )}
                  data-testid={`streak-milestone-${m}`}
                >
                  {achieved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Target className="w-3.5 h-3.5" />
                  )}
                  <span>{m}-Win Streak</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <SkillsGrid skillMap={skillMap} />

      {/* Wardcraft Section */}
      <div>
        <h2 className="text-xl font-display text-[#ffd700] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Wardcraft
        </h2>
        <div className="osrs-panel bg-[#2b231a] p-5">
          <p className="text-[#d6c3a1] text-sm mb-4">
            Check your daily wards to earn Wardcraft XP. Keep your portfolio diversified and avoid
            over-exposure to any single market.
          </p>
          <button
            className="px-4 py-2 bg-[#5b4c39] border-2 border-[#ffd700]/50 text-[#ffd700] font-display text-sm hover:bg-[#6b5c49] transition-colors"
            onClick={() => wardcheck.mutate()}
            disabled={wardcheck.isPending}
            data-testid="button-check-daily-wards"
          >
            {wardcheck.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </span>
            ) : (
              "Check Daily Wards"
            )}
          </button>
        </div>
      </div>

      {/* Combat Achievement Diary */}
      <DiaryAccordion groupedDiary={groupedDiary} diaryTasks={diaryTasks} />
    </div>
  );
}
