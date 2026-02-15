import { useMarket, useTradeMarket, useResolveMarket } from "@/hooks/use-markets";
import { useUserMe } from "@/hooks/use-user-data";
import { useParams } from "wouter";
import { useState } from "react";
import { OsrsButton } from "@/components/OsrsButton";
import { Loader2, Calendar, Lock, ShieldAlert, Clock, Eye } from "lucide-react";
import gpIcon from "@assets/image_1771135726835.png";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useXpDrops } from "@/components/XpDropToast";

export default function MarketDetail() {
  const { slug } = useParams();
  const { data: market, isLoading } = useMarket(slug || "");
  const { data: user } = useUserMe();
  const { mutate: trade, isPending: isTrading } = useTradeMarket();
  const { mutate: resolve, isPending: isResolving } = useResolveMarket();

  const { showXpDrops } = useXpDrops();

  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [shareAmount, setShareAmount] = useState<number>(1);
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");
  const [scryEntry, setScryEntry] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-16 h-16 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  if (!market) {
    return <div className="text-center py-20 text-[#d6c3a1]">Market not found.</div>;
  }

  const handleTrade = () => {
    if (!selectedOutcome || !market.id) return;
    trade({
      marketId: market.id,
      outcomeId: selectedOutcome,
      shares: shareAmount,
      action: tradeAction,
      ...(tradeAction === "BUY" && scryEntry ? { scryEntry: true } : {}),
    }, {
      onSuccess: (data) => {
        if (data.xpDrops && data.xpDrops.length > 0) {
          showXpDrops(data.xpDrops);
        }
        setShareAmount(1);
        setSelectedOutcome(null);
        setScryEntry(false);
      }
    });
  };

  const isMarketClosed = market.status !== "OPEN";
  const userIsAdmin = user?.isAdmin;

  const now = Date.now();
  const createdAt = market.createdAt ? new Date(market.createdAt).getTime() : now - 86400000;
  const closeTime = market.closeTime ? new Date(market.closeTime).getTime() : now + 86400000;
  const lifespan = Math.max(closeTime - createdAt, 1);
  const earlyEnd = createdAt + lifespan * 0.1;
  const clutchDuration = Math.min(lifespan * 0.1, 60 * 60 * 1000);
  const clutchStart = closeTime - clutchDuration;

  const isInEarlyWindow = now >= createdAt && now <= earlyEnd;
  const isInClutchWindow = now >= clutchStart && now <= closeTime;

  const formatWindowTime = (ts: number) => new Date(ts).toLocaleString();

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="osrs-panel p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5 bg-no-repeat bg-right-top" style={{ backgroundImage: `url(${gpIcon})`, imageRendering: "pixelated" } as React.CSSProperties}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-black/50 border border-[#5b4c39] rounded text-[#ffd700] text-xs font-bold uppercase">
              {market.category}
            </span>
            {isMarketClosed && (
              <span className="px-3 py-1 bg-red-900/50 border border-red-800 rounded text-red-200 text-xs font-bold uppercase flex items-center gap-1">
                <Lock className="w-3 h-3" /> {market.status}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-display text-[#ffd700] mb-4 leading-tight">
            {market.title}
          </h1>
          
          <p className="text-lg text-[#d6c3a1] max-w-3xl mb-6">
            {market.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-[#5b4c39]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Closes: {new Date(market.closeTime).toLocaleString()}</span>
            </div>
            <div>
              Liquidity: <span className="text-[#d6c3a1] font-mono">{market.liquidityB} GP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Windows */}
      <div className="osrs-panel p-4 mb-8 flex flex-col sm:flex-row gap-4" data-testid="timing-windows">
        <div className={cn(
          "flex-1 p-3 rounded border-2 flex items-center gap-3",
          isInEarlyWindow
            ? "border-[#ffd700] bg-[#ffd700]/10"
            : "border-[#5b4c39] bg-black/20"
        )} data-testid="timing-early-window">
          <Clock className="w-5 h-5 text-[#ffd700] shrink-0" />
          <div>
            {isInEarlyWindow ? (
              <span className="text-[#ffd700] font-bold text-sm uppercase">EARLY WINDOW - Tickcraft XP</span>
            ) : now < earlyEnd ? (
              <span className="text-[#d6c3a1] text-sm">Early Window: starts {formatWindowTime(createdAt)}</span>
            ) : (
              <span className="text-[#5b4c39] text-sm">Early Window: ended {formatWindowTime(earlyEnd)}</span>
            )}
          </div>
        </div>
        <div className={cn(
          "flex-1 p-3 rounded border-2 flex items-center gap-3",
          isInClutchWindow
            ? "border-red-500 bg-red-900/20"
            : "border-[#5b4c39] bg-black/20"
        )} data-testid="timing-clutch-window">
          <Clock className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            {isInClutchWindow ? (
              <span className="text-red-400 font-bold text-sm uppercase">CLUTCH WINDOW - Tickcraft XP</span>
            ) : now < clutchStart ? (
              <span className="text-[#d6c3a1] text-sm">Clutch Window: starts {formatWindowTime(clutchStart)}</span>
            ) : (
              <span className="text-[#5b4c39] text-sm">Clutch Window: ended {formatWindowTime(closeTime)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Outcomes List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-display text-[#d6c3a1] mb-4">Outcomes</h2>
          {market.outcomes.map((outcome) => (
            <div 
              key={outcome.id} 
              className={cn(
                "osrs-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all cursor-pointer border-2",
                selectedOutcome === outcome.id 
                  ? "border-[#ffd700] bg-black/20" 
                  : "border-[#5b4c39] hover:border-[#d6c3a1]"
              )}
              onClick={() => !isMarketClosed && setSelectedOutcome(outcome.id)}
            >
              <div className="flex-grow text-center sm:text-left">
                <span className="text-lg font-bold text-[#d6c3a1]">{outcome.name}</span>
                <div className="text-xs text-[#5b4c39]">Shares traded: {outcome.shareCount}</div>
              </div>

              {/* Pseudo-probability bar */}
              <div className="w-full sm:w-1/3 h-4 bg-black/40 rounded-full border border-[#5b4c39] overflow-hidden">
                <div className="h-full bg-[#ffd700]" style={{ width: '50%' }}></div> 
              </div>

              {!isMarketClosed ? (
                <div className="flex gap-2">
                  <OsrsButton 
                    variant="primary" 
                    size="sm"
                    className="text-xs py-1 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOutcome(outcome.id);
                      setTradeAction("BUY");
                    }}
                  >
                    Buy
                  </OsrsButton>
                  <OsrsButton 
                    variant="secondary" 
                    size="sm"
                    className="text-xs py-1 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOutcome(outcome.id);
                      setTradeAction("SELL");
                    }}
                  >
                    Sell
                  </OsrsButton>
                </div>
              ) : (
                <div className="text-xs text-red-400 font-mono uppercase">Trading Closed</div>
              )}
            </div>
          ))}
        </div>

        {/* Trade Sidebar */}
        <div>
          <div className="osrs-panel p-6 sticky top-24">
            <h2 className="text-lg font-display text-[#ffd700] mb-4 border-b border-[#5b4c39] pb-2 text-center">
              Trade Desk
            </h2>

            {!selectedOutcome ? (
              <div className="text-center py-8 text-[#5b4c39]">
                <p>Select an outcome to trade.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <span className={cn(
                    "text-xs font-bold uppercase px-2 py-1 rounded",
                    tradeAction === "BUY" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                  )}>
                    {tradeAction} Shares
                  </span>
                  <div className="mt-2 text-[#d6c3a1] font-bold">
                    {market.outcomes.find(o => o.id === selectedOutcome)?.name}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#5b4c39] uppercase">Amount</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full bg-[#1e1812] border-2 border-[#5b4c39] text-[#ffd700] text-center font-mono text-xl py-3 rounded focus:border-[#ffd700] focus:outline-none"
                    value={shareAmount}
                    onChange={(e) => setShareAmount(parseInt(e.target.value) || 0)}
                  />
                </div>

                {tradeAction === "BUY" && (
                  <label
                    className="flex items-center gap-2 cursor-pointer p-2 rounded border border-[#5b4c39] bg-black/20 hover:border-[#d6c3a1] transition-colors"
                    data-testid="checkbox-scry-entry"
                  >
                    <input
                      type="checkbox"
                      checked={scryEntry}
                      onChange={(e) => setScryEntry(e.target.checked)}
                      className="accent-[#ffd700] w-4 h-4"
                    />
                    <Eye className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-sm text-[#d6c3a1]">Scry this entry</span>
                  </label>
                )}

                {user ? (
                  <OsrsButton 
                    variant={tradeAction === "BUY" ? "primary" : "danger"} 
                    className="w-full py-4 text-lg"
                    onClick={handleTrade}
                    isLoading={isTrading}
                    disabled={shareAmount <= 0}
                  >
                    Confirm {tradeAction}
                  </OsrsButton>
                ) : (
                  <a href="/api/login" className="block">
                    <OsrsButton className="w-full">Log In to Trade</OsrsButton>
                  </a>
                )}
                
                <p className="text-xs text-center text-[#5b4c39]">
                  {tradeAction === "BUY" 
                    ? "Cost will be deducted from your GP balance." 
                    : "Proceeds will be added to your GP balance."}
                </p>
              </div>
            )}
          </div>
          
          {/* Admin Tools */}
          {userIsAdmin && (
            <div className="mt-8 osrs-panel p-4 border-red-900/50">
              <h3 className="text-red-400 font-display text-xs mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Admin Zone
              </h3>
              
              <Dialog>
                <DialogTrigger asChild>
                  <OsrsButton variant="danger" className="w-full text-xs">Resolve Market</OsrsButton>
                </DialogTrigger>
                <DialogContent className="osrs-panel bg-[hsl(var(--osrs-bg-panel))]">
                  <DialogHeader>
                    <DialogTitle className="text-[#ffd700] font-display">Resolve Market</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-[#d6c3a1] text-sm">Select the winning outcome. This action is irreversible.</p>
                    {market.outcomes.map(o => (
                      <button 
                        key={o.id}
                        className="w-full p-3 text-left border border-[#5b4c39] hover:bg-black/20 text-[#d6c3a1] hover:text-[#ffd700]"
                        onClick={() => resolve({ marketId: market.id, outcomeId: o.id })}
                        disabled={isResolving}
                      >
                        {o.name}
                      </button>
                    ))}
                    <button 
                      className="w-full p-3 text-left border border-red-900 text-red-400 hover:bg-red-900/20"
                      onClick={() => resolve({ marketId: market.id, outcomeId: null })} // Invalid
                      disabled={isResolving}
                    >
                      Declare Invalid (Refund All)
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
