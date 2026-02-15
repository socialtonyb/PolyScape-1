import { useState } from "react";
import { useAchievements, useUserMe } from "@/hooks/use-user-data";
import { Loader2, Star, Trophy, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tier = "EASY" | "MEDIUM" | "HARD" | "ELITE" | "GRANDMASTER";

interface TaskDef {
  slug: string;
  title: string;
  description: string;
  tier: Tier;
  rewardXp: number;
  rewardGp: number;
}

const ALL_TASKS: TaskDef[] = [
  { slug: "first_trade", title: "First Steps", description: "Complete your first trade on the market.", tier: "EASY", rewardXp: 50, rewardGp: 500 },
  { slug: "level_5", title: "Novice Predictor", description: "Reach Prediction Level 5.", tier: "EASY", rewardXp: 100, rewardGp: 1000 },
  { slug: "random_event", title: "Lucky Find", description: "Claim a reward from a random event.", tier: "EASY", rewardXp: 50, rewardGp: 250 },
  { slug: "three_markets", title: "Diversified", description: "Hold positions in 3 different markets.", tier: "EASY", rewardXp: 75, rewardGp: 750 },
  { slug: "buy_10_shares", title: "Bulk Buyer", description: "Buy 10 or more shares in a single trade.", tier: "EASY", rewardXp: 50, rewardGp: 500 },

  { slug: "profit_10k", title: "Merchant", description: "Earn 10,000 GP from market resolutions.", tier: "MEDIUM", rewardXp: 200, rewardGp: 2500 },
  { slug: "level_10", title: "Journeyman", description: "Reach Prediction Level 10.", tier: "MEDIUM", rewardXp: 300, rewardGp: 3000 },
  { slug: "five_trades", title: "Regular Trader", description: "Complete 5 trades.", tier: "MEDIUM", rewardXp: 150, rewardGp: 1500 },
  { slug: "sell_profit", title: "Savvy Seller", description: "Sell shares at a higher price than you bought them.", tier: "MEDIUM", rewardXp: 200, rewardGp: 2000 },
  { slug: "three_randoms", title: "Event Veteran", description: "Claim 3 random event rewards.", tier: "MEDIUM", rewardXp: 250, rewardGp: 2500 },

  { slug: "whale", title: "High Roller", description: "Hold positions worth over 100,000 GP.", tier: "HARD", rewardXp: 500, rewardGp: 10000 },
  { slug: "level_25", title: "Expert Analyst", description: "Reach Prediction Level 25.", tier: "HARD", rewardXp: 750, rewardGp: 7500 },
  { slug: "twenty_trades", title: "Market Maker", description: "Complete 20 trades.", tier: "HARD", rewardXp: 400, rewardGp: 5000 },
  { slug: "profit_100k", title: "Wealthy Merchant", description: "Accumulate 100,000 GP total profit.", tier: "HARD", rewardXp: 600, rewardGp: 10000 },

  { slug: "level_50", title: "Grandmaster Predictor", description: "Reach Prediction Level 50.", tier: "ELITE", rewardXp: 1500, rewardGp: 25000 },
  { slug: "profit_1m", title: "Millionaire", description: "Accumulate 1,000,000 GP.", tier: "ELITE", rewardXp: 2000, rewardGp: 50000 },
  { slug: "fifty_trades", title: "Trading Legend", description: "Complete 50 trades.", tier: "ELITE", rewardXp: 1000, rewardGp: 15000 },

  { slug: "level_99", title: "Max Level", description: "Reach Prediction Level 99.", tier: "GRANDMASTER", rewardXp: 5000, rewardGp: 100000 },
  { slug: "all_elite", title: "Completionist", description: "Complete all Elite tier tasks.", tier: "GRANDMASTER", rewardXp: 10000, rewardGp: 250000 },
];

const TIER_CONFIG: Record<Tier, { label: string; color: string; bgColor: string; borderColor: string; swordImage: string; glowColor: string }> = {
  EASY: {
    label: "Easy",
    color: "text-green-400",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-800",
    swordImage: "/images/sword-easy.png",
    glowColor: "shadow-green-500/30",
  },
  MEDIUM: {
    label: "Medium",
    color: "text-blue-400",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-800",
    swordImage: "/images/sword-medium.png",
    glowColor: "shadow-blue-500/30",
  },
  HARD: {
    label: "Hard",
    color: "text-yellow-400",
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-800",
    swordImage: "/images/sword-hard.png",
    glowColor: "shadow-yellow-500/30",
  },
  ELITE: {
    label: "Elite",
    color: "text-red-400",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-800",
    swordImage: "/images/sword-elite.png",
    glowColor: "shadow-red-500/30",
  },
  GRANDMASTER: {
    label: "Grandmaster",
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-800",
    swordImage: "/images/sword-grandmaster.png",
    glowColor: "shadow-purple-500/30",
  },
};

const TIERS: Tier[] = ["EASY", "MEDIUM", "HARD", "ELITE", "GRANDMASTER"];

export default function Achievements() {
  const [activeTier, setActiveTier] = useState<Tier>("EASY");
  const { data: completed, isLoading } = useAchievements();
  const { data: user } = useUserMe();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  const completedSlugs = new Set(completed?.map((a) => a.achievementSlug));
  const tierTasks = ALL_TASKS.filter((t) => t.tier === activeTier);
  const tierCompleted = tierTasks.filter((t) => completedSlugs.has(t.slug)).length;
  const tierTotal = tierTasks.length;
  const tierProgress = tierTotal > 0 ? Math.round((tierCompleted / tierTotal) * 100) : 0;

  const totalCompleted = ALL_TASKS.filter((t) => completedSlugs.has(t.slug)).length;
  const totalTasks = ALL_TASKS.length;

  const config = TIER_CONFIG[activeTier];

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-[#2b231a] rounded border-2 border-[#5b4c39]">
          <img
            src="/images/book-with-swords.png"
            className="w-10 h-10"
            alt="Achievement Diary"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#ffd700]" data-testid="text-page-title">Combat Achievement Diary</h1>
          <p className="text-[#d6c3a1] text-sm" data-testid="text-total-progress">
            {totalCompleted} / {totalTasks} tasks completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="osrs-panel p-4 bg-[#2b231a]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-display text-[#ffd700]">Prediction Skill</h2>
              <Star className="w-5 h-5 text-[#ffd700] fill-current" />
            </div>
            <div className="text-center mb-4">
              <div className="text-5xl font-display text-white mb-1" style={{ textShadow: "2px 2px 0px #000" }} data-testid="text-skill-level">
                {user ? Math.floor(user.predictionXp / 1000) + 1 : 1}
              </div>
              <div className="text-[10px] uppercase text-[#5b4c39] font-bold tracking-wider">Current Level</div>
            </div>
            <div className="bg-black/40 rounded-sm h-3 overflow-hidden border border-[#5b4c39] relative">
              <div
                className="h-full bg-gradient-to-r from-yellow-600 to-[#ffd700] transition-all duration-500"
                style={{ width: `${((user?.predictionXp || 0) % 1000) / 10}%` }}
              ></div>
            </div>
            <div className="text-right text-[10px] text-[#d6c3a1] mt-1">
              {user?.predictionXp || 0} / {Math.ceil(((user?.predictionXp || 0) + 1) / 1000) * 1000} XP
            </div>
          </div>

          <div className="osrs-panel bg-[#2b231a] overflow-hidden">
            <div className="p-3 border-b border-[#5b4c39]">
              <h2 className="text-xs font-display text-[#ffd700]">Tier Select</h2>
            </div>
            {TIERS.map((tier) => {
              const tc = TIER_CONFIG[tier];
              const tasks = ALL_TASKS.filter((t) => t.tier === tier);
              const done = tasks.filter((t) => completedSlugs.has(t.slug)).length;
              const isActive = activeTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 text-left transition-all border-l-4",
                    isActive
                      ? cn("bg-black/30", tc.borderColor, tc.color)
                      : "border-transparent text-[#d6c3a1]"
                  )}
                  data-testid={`button-tier-${tier.toLowerCase()}`}
                >
                  <img
                    src={tc.swordImage}
                    className="w-6 h-6"
                    alt={tc.label}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-display truncate" data-testid={`text-tier-label-${tier.toLowerCase()}`}>{tc.label}</div>
                    <div className="text-[10px] opacity-60" data-testid={`text-tier-count-${tier.toLowerCase()}`}>
                      {done}/{tasks.length}
                    </div>
                  </div>
                  {done === tasks.length && tasks.length > 0 && (
                    <CheckCircle2 className={cn("w-4 h-4 shrink-0", tc.color)} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="osrs-panel p-4 bg-[#2b231a]">
            <h2 className="text-xs font-display text-[#ffd700] mb-2">Overall Progress</h2>
            <div className="bg-black/40 rounded-sm h-3 overflow-hidden border border-[#5b4c39] relative">
              <div
                className="h-full bg-gradient-to-r from-green-700 to-green-400 transition-all duration-500"
                style={{ width: `${totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%` }}
              ></div>
            </div>
            <div className="text-right text-[10px] text-[#d6c3a1] mt-1" data-testid="text-overall-count">
              {totalCompleted} / {totalTasks}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className={cn("osrs-panel bg-[#2b231a] overflow-hidden")}>
            <div className={cn("flex items-center gap-3 p-4 border-b border-[#5b4c39]", config.bgColor)}>
              <img
                src={config.swordImage}
                className="w-8 h-8"
                alt={config.label}
                style={{ imageRendering: "pixelated" }}
              />
              <div className="flex-grow">
                <h2 className={cn("text-lg font-display", config.color)}>{config.label} Tasks</h2>
                <div className="text-[10px] text-[#d6c3a1]">
                  {tierCompleted} of {tierTotal} completed
                </div>
              </div>
              <div className="text-right">
                <span className={cn("text-2xl font-display", config.color)} data-testid="text-tier-progress-pct">{tierProgress}%</span>
              </div>
            </div>

            <div className="p-2">
              <div className="bg-black/30 rounded-sm h-2 overflow-hidden border border-[#5b4c39] mx-2 mt-2 mb-1">
                <div
                  className={cn("h-full transition-all duration-700", {
                    "bg-gradient-to-r from-green-700 to-green-400": activeTier === "EASY",
                    "bg-gradient-to-r from-blue-700 to-blue-400": activeTier === "MEDIUM",
                    "bg-gradient-to-r from-yellow-700 to-yellow-400": activeTier === "HARD",
                    "bg-gradient-to-r from-red-700 to-red-400": activeTier === "ELITE",
                    "bg-gradient-to-r from-purple-700 to-purple-400": activeTier === "GRANDMASTER",
                  })}
                  style={{ width: `${tierProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="divide-y divide-[#5b4c39]/30">
              {tierTasks.map((task) => {
                const isDone = completedSlugs.has(task.slug);
                return (
                  <div
                    key={task.slug}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 transition-all",
                      isDone ? "bg-black/10" : "opacity-70"
                    )}
                    data-testid={`task-row-${task.slug}`}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center border-2 rounded-sm shrink-0 transition-all",
                        isDone
                          ? cn(config.bgColor, config.borderColor, "shadow-lg", config.glowColor)
                          : "bg-black/20 border-[#5b4c39]/50"
                      )}
                    >
                      {isDone ? (
                        <img
                          src={config.swordImage}
                          className="w-6 h-6"
                          alt="Completed"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <Lock className="w-4 h-4 text-[#5b4c39]" />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3
                        className={cn(
                          "font-display text-sm",
                          isDone ? cn(config.color) : "text-[#d6c3a1]/80"
                        )}
                        data-testid={`text-task-title-${task.slug}`}
                      >
                        {isDone && <span className="mr-1">&#10003;</span>}
                        {task.title}
                      </h3>
                      <p className="text-xs text-[#d6c3a1]/60 leading-relaxed" data-testid={`text-task-desc-${task.slug}`}>{task.description}</p>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <div className="text-[10px] text-[#ffd700] font-display" data-testid={`text-reward-xp-${task.slug}`}>+{task.rewardXp} XP</div>
                      <div className="text-[10px] text-[#00ff00] font-mono" data-testid={`text-reward-gp-${task.slug}`}>+{task.rewardGp.toLocaleString()} GP</div>
                    </div>
                  </div>
                );
              })}

              {tierTasks.length === 0 && (
                <div className="p-8 text-center text-[#d6c3a1]/50">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No tasks in this tier yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
