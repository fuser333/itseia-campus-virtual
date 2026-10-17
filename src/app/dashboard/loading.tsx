import { Brain } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome header skeleton */}
      <div>
        <div className="h-9 w-64 rounded-lg bg-[#1F2F58]/10" />
        <div className="mt-2 h-5 w-96 rounded-lg bg-[#1F2F58]/5" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[#1F2F58]/5 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-xl bg-[#1F2F58]/5" />
              <div>
                <div className="h-4 w-20 rounded bg-[#1F2F58]/5" />
                <div className="mt-2 h-7 w-12 rounded bg-[#1F2F58]/10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue card skeleton */}
      <div className="rounded-xl bg-gradient-to-r from-[#1F2F58] to-[#0A1628] p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/10" />
          <div>
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="mt-2 h-5 w-56 rounded bg-white/20" />
          </div>
        </div>
      </div>

      {/* Programs skeleton */}
      <div>
        <div className="h-7 w-36 rounded-lg bg-[#1F2F58]/10 mb-4" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-xl border border-[#1F2F58]/5 bg-white p-6">
              <div className="h-10 w-10 rounded-lg bg-[#1F2F58]/5 mb-4" />
              <div className="h-5 w-40 rounded bg-[#1F2F58]/10 mb-2" />
              <div className="h-4 w-full rounded bg-[#1F2F58]/5 mb-4" />
              <div className="h-2 w-full rounded-full bg-[#1F2F58]/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
