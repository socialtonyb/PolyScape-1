import { useWallet } from "@/hooks/use-user-data";
import { Loader2, Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import gpIcon from "@assets/image_1771135726835.png";
import { cn } from "@/lib/utils";

export default function Wallet() {
  const { data: wallet, isLoading } = useWallet();

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
          <WalletIcon className="w-8 h-8 text-[#ffd700]" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-[#ffd700]">Coin Pouch</h1>
          <p className="text-[#d6c3a1]">Manage your gold pieces.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Main Balance Card */}
        <div className="md:col-span-1 osrs-panel p-8 flex flex-col items-center justify-center text-center bg-[#2b231a]">
          <div className="w-20 h-20 mb-4 flex items-center justify-center">
             <img src={gpIcon} alt="GP" className="w-16 h-16" style={{ imageRendering: "pixelated" }} />
          </div>
          <h2 className="text-[#d6c3a1] text-lg mb-2">Current Balance</h2>
          <div className="text-4xl font-display text-[#ffd700] text-shadow">{wallet?.balanceGp.toLocaleString()} GP</div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-2 osrs-panel p-0 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-[#2b231a] border-b border-[#5b4c39]">
            <h3 className="font-display text-[#d6c3a1]">Transaction Ledger</h3>
          </div>
          
          <div className="overflow-y-auto flex-grow custom-scrollbar">
            {wallet?.transactions.length === 0 ? (
              <div className="text-center p-12 text-[#5b4c39]">No transactions yet.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#2b231a] text-xs uppercase text-[#5b4c39]">
                  <tr>
                    <th className="p-4">Type</th>
                    <th className="p-4">Details</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5b4c39]/30">
                  {wallet?.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-black/10">
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold border",
                          tx.amountGp > 0 
                            ? "bg-green-900/30 border-green-900 text-green-400" 
                            : "bg-red-900/30 border-red-900 text-red-400"
                        )}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#d6c3a1]">
                        {/* Safe handling of metadata if it exists */}
                        {(tx.metadata as any)?.marketId ? `Market #${(tx.metadata as any).marketId}` : "System Transfer"}
                      </td>
                      <td className={cn(
                        "p-4 text-right font-mono font-bold",
                        tx.amountGp > 0 ? "text-[#00ff00]" : "text-red-400"
                      )}>
                        {tx.amountGp > 0 ? "+" : ""}{tx.amountGp} GP
                      </td>
                      <td className="p-4 text-right text-xs text-[#5b4c39]">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
