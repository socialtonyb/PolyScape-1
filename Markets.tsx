import { useMarkets } from "@/hooks/use-markets";
import { Link } from "wouter";
import { useState } from "react";
import { OsrsButton } from "@/components/OsrsButton";
import { Loader2, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["PvP", "Quests", "Economy", "Wilderness", "Updates"];

export default function Markets() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: markets, isLoading } = useMarkets({ 
    search: search || undefined, 
    category,
    status: "OPEN" 
  });

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-display text-[#ffd700] mb-2">Grand Exchange</h1>
          <p className="text-[#d6c3a1]">Browse all active prediction markets.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d6c3a1]" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full pl-10 pr-4 py-2 bg-[#1e1812] border-2 border-[#5b4c39] rounded text-[#d6c3a1] placeholder:text-[#5b4c39] focus:outline-none focus:border-[#ffd700]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-[#1e1812] border-2 border-[#5b4c39] rounded text-[#d6c3a1] focus:outline-none focus:border-[#ffd700]"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value || undefined)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#ffd700] animate-spin" />
        </div>
      ) : markets?.length === 0 ? (
        <div className="text-center py-20 osrs-panel opacity-80">
          <Filter className="w-12 h-12 text-[#5b4c39] mx-auto mb-4" />
          <h3 className="text-xl text-[#d6c3a1]">No markets found.</h3>
          <p className="text-sm text-[#5b4c39]">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {markets?.map((market) => (
            <Link key={market.id} href={`/markets/${market.slug}`}>
              <a className="block group">
                <div className="osrs-panel p-6 flex flex-col md:flex-row gap-6 hover:border-[#ffd700] transition-colors relative overflow-hidden">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd700] bg-black/40 px-2 py-1 rounded border border-[#5b4c39]">
                        {market.category}
                      </span>
                      <span className="text-[10px] text-[#5b4c39] font-mono">
                        Ends {new Date(market.closeTime).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-display text-[#d6c3a1] group-hover:text-white mb-2">
                      {market.title}
                    </h3>
                    <p className="text-sm text-[#d6c3a1]/60 line-clamp-2 mb-4">
                      {market.description}
                    </p>
                    
                    {/* Mini Outcome Bars */}
                    <div className="space-y-2">
                      {market.outcomes.slice(0, 2).map((outcome, idx) => (
                        <div key={outcome.id} className="flex items-center gap-2 text-xs">
                          <span className="w-12 text-[#d6c3a1] truncate text-right">{outcome.name}</span>
                          <div className="flex-grow h-2 bg-black/40 rounded-full overflow-hidden border border-[#5b4c39]/50">
                            <div 
                              className={cn("h-full", idx === 0 ? "bg-[#00ff00]" : "bg-red-500")} 
                              style={{ width: `${Math.random() * 80 + 10}%` }} // Mock probability for visual flare
                            />
                          </div>
                          <span className="text-[#ffd700] w-8">--%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center md:border-l md:border-[#5b4c39] md:pl-6 min-w-[120px]">
                    <OsrsButton className="w-full">Trade</OsrsButton>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
