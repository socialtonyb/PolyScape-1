import { useMarkets } from "@/hooks/use-markets";
import { useUserMe } from "@/hooks/use-user-data";
import { Link } from "wouter";
import { OsrsButton } from "@/components/OsrsButton";
import { Loader2, TrendingUp, Users, Crown, ChevronRight } from "lucide-react";
import gpIcon from "@assets/image_1771135726835.png";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: markets, isLoading } = useMarkets({ status: "OPEN" });
  const { data: user } = useUserMe();

  const featuredMarkets = markets?.slice(0, 3);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 text-center border-b-4 border-[#5b4c39] bg-[#2b231a]">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-display text-[#ffd700] mb-6 animate-in slide-in-from-bottom-5 duration-700">
            Grand Exchange <br /> for Gielinor
          </h1>
          <p className="text-xl md:text-2xl text-[#d6c3a1] max-w-2xl mx-auto mb-8 font-body">
            Trade on the future of OSRS. Quests, PvP tournaments, Economy updates, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/markets">
              <OsrsButton variant="primary" className="text-lg px-8 py-4">
                Start Trading
              </OsrsButton>
            </Link>
            {!user && (
              <a href="/api/login">
                <OsrsButton className="text-lg px-8 py-4">
                  Log In
                </OsrsButton>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-display text-[#ffd700]">Featured Offers</h2>
          <Link href="/markets">
            <a className="text-[#d6c3a1] hover:text-[#ffd700] flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#ffd700] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMarkets?.map((market) => (
              <Link key={market.id} href={`/markets/${market.slug}`}>
                <a className="block group">
                  <article className="h-full osrs-panel p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Crown className="w-24 h-24" />
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-xs font-bold bg-black/40 px-2 py-1 rounded text-[#ffd700] border border-[#5b4c39]">
                        {market.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-display text-[#d6c3a1] group-hover:text-white mb-3 leading-snug">
                      {market.title}
                    </h3>
                    
                    <p className="text-sm text-[#d6c3a1]/70 mb-6 flex-grow line-clamp-3">
                      {market.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-sm border-t border-[#5b4c39] pt-4">
                      <div className="flex items-center gap-2 text-[#ffd700]">
                        <TrendingUp className="w-4 h-4" />
                        <span>Vol: {market.liquidityB} GP</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#d6c3a1]">
                        <Users className="w-4 h-4" />
                        <span>Open</span>
                      </div>
                    </div>
                  </article>
                </a>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      {user && (
        <section className="container mx-auto px-4 pb-20">
          <div className="osrs-panel p-8 bg-[#2b231a]">
            <h2 className="text-2xl font-display text-[#ffd700] mb-6 text-center">Your Adventure Log</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-black/20 p-6 rounded border border-[#5b4c39]">
                <div className="flex items-center justify-center gap-2">
                  <img src={gpIcon} alt="GP" className="w-8 h-8" style={{ imageRendering: "pixelated" }} />
                  <div className="text-4xl font-display text-[#ffd700]">{user.balanceGp}</div>
                </div>
                <div className="text-sm text-[#d6c3a1] uppercase tracking-wider mt-2">Gold Pieces</div>
              </div>
              <div className="bg-black/20 p-6 rounded border border-[#5b4c39]">
                <div className="text-4xl font-display text-[#00ff00] mb-2">{Math.floor(user.predictionXp / 1000) + 1}</div>
                <div className="text-sm text-[#d6c3a1] uppercase tracking-wider">Prediction Level</div>
              </div>
              <div className="bg-black/20 p-6 rounded border border-[#5b4c39]">
                <div className="text-4xl font-display text-cyan-400 mb-2">{user.predictionXp}</div>
                <div className="text-sm text-[#d6c3a1] uppercase tracking-wider">Total XP</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
