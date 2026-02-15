import { usePortfolio } from "@/hooks/use-user-data";
import { Loader2, Scroll, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { OsrsButton } from "@/components/OsrsButton";

export default function Portfolio() {
  const { data: positions, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#2b231a] rounded-full border-2 border-[#5b4c39]">
          <Scroll className="w-8 h-8 text-[#ffd700]" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#ffd700]">Your Portfolio</h1>
          <p className="text-[#d6c3a1]">Track your active predictions and assets.</p>
        </div>
      </div>

      {!positions || positions.length === 0 ? (
        <div className="osrs-panel p-12 text-center">
          <p className="text-[#d6c3a1] mb-6">You don't have any active positions yet.</p>
          <Link href="/markets">
            <OsrsButton variant="primary">Browse Grand Exchange</OsrsButton>
          </Link>
        </div>
      ) : (
        <div className="osrs-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#2b231a] border-b-2 border-[#5b4c39] text-[#ffd700] font-display text-sm">
                  <th className="p-4">Market</th>
                  <th className="p-4">Outcome</th>
                  <th className="p-4 text-right">Shares</th>
                  <th className="p-4 text-right">Est. Value</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5b4c39]">
                {positions.map((pos) => (
                  <tr key={pos.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <Link href={`/markets/${pos.market.slug}`}>
                        <a className="text-[#d6c3a1] hover:text-[#ffd700] font-bold flex items-center gap-2 group">
                          {pos.market.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </Link>
                    </td>
                    <td className="p-4 text-[#d6c3a1]">
                      {pos.outcome.name}
                    </td>
                    <td className="p-4 text-right font-mono text-[#ffd700]">
                      {pos.shares}
                    </td>
                    <td className="p-4 text-right font-mono text-[#d6c3a1]">
                      {/* Very rough estimation logic for display purposes */}
                      {(pos.shares * 0.5).toFixed(0)} GP
                    </td>
                    <td className="p-4 text-center">
                      <Link href={`/markets/${pos.market.slug}`}>
                        <OsrsButton size="sm" className="text-xs py-1 px-3">Manage</OsrsButton>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
