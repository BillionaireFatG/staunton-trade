import { Archive } from 'lucide-react';

export default function ArchivedDealsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#666]/20 to-[#666]/5 flex items-center justify-center">
            <Archive size={18} className="text-[#666]" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Archived Deals</h1>
        </div>
        <p className="text-[13px] text-[#666] ml-[52px]">Closed or cancelled transactions</p>
      </div>

      <div className="rounded-xl bg-[#111113] border border-[#1a1a1a] p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#111113] border border-[#262626] flex items-center justify-center">
          <Archive size={24} className="text-[#555]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No archived deals</h3>
        <p className="text-[13px] text-[#666] max-w-sm mx-auto">
          Archived deals will appear here when you close or cancel transactions.
        </p>
      </div>
    </div>
  );
}


