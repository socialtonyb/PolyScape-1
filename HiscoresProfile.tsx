import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Loader2, ArrowLeft, User, Coins, TrendingUp, Target } from "lucide-react";
import { levelForXp, xpProgress, SKILL_META, type SkillSlug } from "@shared/xp";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SKILL_SLUGS: SkillSlug[] = [
  "augury", "scrying", "merchanting", "wardcraft",
  "tickcraft", "wanderer", "fashioncraft", "slayers_focus",
];

export default function HiscoresProfile() {
  const [, params] = useRoute("/hiscores/user/:username");
  const username = params?.username || "";

  const { data, isLoading, error } = useQuery<any>({
    queryKey: [`/api/hiscores/user/${username}`],
    enabled: !!username,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-[#ffd700] animate-spin" data-testid="loader-profile" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/hiscores" className="flex items-center gap-2 text-[#d6c3a1] hover:text-[#ffd700] mb-8 font-body text-lg" data-testid="link-back-hiscores">
          <ArrowLeft className="w-4 h-4" />
          Back to Hiscores
        </Link>
        <div className="text-center py-16 osrs-panel bg-[#2b231a]" data-testid="error-profile">
          <User className="w-12 h-12 text-[#5b4c39] mx-auto mb-4" />
          <p className="text-[#d6c3a1] font-body text-lg">Player not found.</p>
        </div>
      </div>
    );
  }

  const { user: profileUser, skills, stats, predictionAccuracy, lifetimeProfit, recentBets, positions } = data;
  const skillMap = new Map<string, any>((skills || []).map((s: any) => [s.skillSlug, s]));
  const memberSince = profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown";

  return (
    <div className="container mx-auto px-4 py-8 pb-24 space-y-8">
      <Link href="/hiscores" className="flex items-center gap-2 text-[#d6c3a1] hover:text-[#ffd700] font-body text-lg" data-testid="link-back-hiscores">
        <ArrowLeft className="w-4 h-4" />
        Back to Hiscores
      </Link>

      <div className="osrs-panel bg-[#2b231a] p-6">
        <div className="flex items-center gap-6 flex-wrap">
          <Avatar className="w-20 h-20 border-2 border-[#5b4c39]">
            <AvatarImage src={profileUser?.profileImageUrl} alt={username} />
            <AvatarFallback className="bg-[#3e3529] text-[#ffd700] font-display text-2xl">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-display text-[#ffd700]" data-testid="text-profile-username">
              {username}
            </h1>
            <p className="text-[#d6c3a1]/60 font-body text-lg" data-testid="text-member-since">
              Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="osrs-panel bg-[#2b231a] p-5 text-center">
          <Coins className="w-6 h-6 text-[#ffd700] mx-auto mb-2" />
          <div className="text-xs font-display text-[#ffd700] mb-1">GP Balance</div>
          <div className="text-2xl font-display text-[#00ff00]" data-testid="text-profile-balance">
            {(profileUser?.balanceGp || 0).toLocaleString()}
          </div>
        </div>
        <div className="osrs-panel bg-[#2b231a] p-5 text-center">
          <TrendingUp className="w-6 h-6 text-[#00ff00] mx-auto mb-2" />
          <div className="text-xs font-display text-[#ffd700] mb-1">Lifetime Profit</div>
          <div className={cn("text-2xl font-display", (lifetimeProfit || 0) >= 0 ? "text-[#00ff00]" : "text-red-400")} data-testid="text-profile-profit">
            {(lifetimeProfit || 0).toLocaleString()} GP
          </div>
        </div>
        <div className="osrs-panel bg-[#2b231a] p-5 text-center">
          <Target className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
          <div className="text-xs font-display text-[#ffd700] mb-1">Prediction Accuracy</div>
          <div className="text-2xl font-display text-cyan-400" data-testid="text-profile-accuracy">
            {predictionAccuracy?.percent ?? 0}%
          </div>
          <div className="text-[#d6c3a1]/60 font-body text-sm" data-testid="text-profile-accuracy-detail">
            {predictionAccuracy?.correct ?? 0} / {predictionAccuracy?.total ?? 0}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display text-[#ffd700] mb-4" data-testid="text-skills-heading">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILL_SLUGS.map((slug) => {
            const sk = skillMap.get(slug);
            const xp = sk?.xp || 0;
            const { level, progress } = xpProgress(xp);
            const meta = SKILL_META[slug];

            return (
              <div key={slug} className="osrs-panel bg-[#2b231a] p-4" data-testid={`profile-skill-${slug}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-display text-xs text-[#d6c3a1]">{meta.name}</h3>
                  <span className="font-display text-sm text-[#00ff00]" data-testid={`text-profile-skill-level-${slug}`}>
                    Lv. {level}
                  </span>
                </div>
                <div className="relative h-3 bg-[#1a1510] border border-[#5b4c39] overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-green-700 via-green-500 to-green-400 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#d6c3a1]/40 font-mono" data-testid={`text-profile-skill-xp-${slug}`}>
                    {xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {positions && positions.length > 0 && (
        <div>
          <h2 className="text-xl font-display text-[#ffd700] mb-4" data-testid="text-positions-heading">Active Positions</h2>
          <div className="osrs-panel bg-[#2b231a] overflow-x-auto">
            <table className="w-full" data-testid="positions-table">
              <thead>
                <tr className="border-b-2 border-[#5b4c39]">
                  <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Market</th>
                  <th className="px-4 py-3 text-left font-display text-xs text-[#ffd700] uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-3 text-right font-display text-xs text-[#ffd700] uppercase tracking-wider">Shares</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos: any, idx: number) => (
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-[#5b4c39]/30",
                      idx % 2 === 1 && "bg-black/10"
                    )}
                    data-testid={`position-row-${idx}`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/markets/${pos.market?.slug}`}
                        className="text-[#d6c3a1] font-body text-lg hover:text-[#ffd700] transition-colors"
                        data-testid={`link-position-market-${idx}`}
                      >
                        {pos.market?.title || "Unknown Market"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#d6c3a1] font-body text-lg" data-testid={`text-position-outcome-${idx}`}>
                      {pos.outcome?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-[#00ff00] font-body text-lg" data-testid={`text-position-shares-${idx}`}>
                      {(pos.shares || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-display text-[#ffd700] mb-4" data-testid="text-activity-heading">Recent Activity</h2>
        {recentBets && recentBets.length > 0 ? (
          <div className="space-y-3">
            {recentBets.slice(0, 5).map((bet: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "osrs-panel bg-[#2b231a] p-4 flex items-center justify-between gap-4 flex-wrap",
                )}
                data-testid={`activity-row-${idx}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "text-xs font-display px-2 py-0.5 border rounded-sm uppercase",
                      bet.type === "BUY"
                        ? "text-[#00ff00] border-green-700"
                        : "text-red-400 border-red-700"
                    )} data-testid={`text-activity-type-${idx}`}>
                      {bet.type}
                    </span>
                    <Link
                      href={`/markets/${bet.market?.slug}`}
                      className="text-[#d6c3a1] font-body text-lg hover:text-[#ffd700] transition-colors truncate"
                      data-testid={`link-activity-market-${idx}`}
                    >
                      {bet.market?.title || "Unknown Market"}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[#00ff00] font-body text-lg" data-testid={`text-activity-amount-${idx}`}>
                    {(bet.amountGp || 0).toLocaleString()} GP
                  </span>
                  <span className="text-[#d6c3a1]/40 font-body text-sm" data-testid={`text-activity-date-${idx}`}>
                    {bet.createdAt ? new Date(bet.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="osrs-panel bg-[#2b231a] p-6 text-center" data-testid="empty-activity">
            <p className="text-[#d6c3a1]/60 font-body text-lg">No recent activity.</p>
          </div>
        )}
      </div>
    </div>
  );
}
