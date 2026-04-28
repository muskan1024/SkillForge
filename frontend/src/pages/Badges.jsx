import { useState, useEffect } from "react";
import api from "../utils/api";
import { Loader2, Award, Lock } from "lucide-react";

export default function Badges() {
  const [data, setData] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    api
      .get("/features/badges")
      .then((r) => {
        setData(r.data);
        setL(false);
      })
      .catch(() => setL(false));
  }, []);

  const earned = data?.all?.filter((b) => b.earned) || [];
  const locked = data?.all?.filter((b) => !b.earned) || [];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink-primary flex items-center gap-2">
          <Award size={22} className="text-brand-600" /> Badges & Achievements
        </h1>
        <p className="text-ink-tertiary mt-1 text-sm">
          Earn badges by reaching milestones in your learning journey
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-4">
            <div className="text-4xl font-black text-brand-600">
              {earned.length}
            </div>
            <div>
              <p className="font-semibold text-ink-primary">badges earned</p>
              <p className="text-sm text-ink-tertiary">
                {locked.length} more to unlock
              </p>
            </div>
            <div className="ml-auto">
              <div className="h-3 w-40 bg-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{
                    width: `${data?.all?.length ? (earned.length / data.all.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-ink-ghost mt-1 text-right">
                {Math.round(
                  data?.all?.length
                    ? (earned.length / data.all.length) * 100
                    : 0,
                )}
                % complete
              </p>
            </div>
          </div>

          {earned.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-ink-secondary mb-4">
                ✅ Earned ({earned.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {earned.map((b) => (
                  <div
                    key={b.id}
                    className="card p-5 text-center hover:shadow-md hover:border-brand-200 transition-all"
                  >
                    <div className="text-4xl mb-3">{b.icon}</div>
                    <p className="font-semibold text-ink-primary text-sm">
                      {b.name}
                    </p>
                    <p className="text-xs text-ink-ghost mt-1">{b.desc}</p>
                    {b.earned_at && (
                      <p className="text-[10px] text-brand-500 mt-2">
                        Earned ✓
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {locked.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-ink-secondary mb-4">
                🔒 Locked ({locked.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {locked.map((b) => (
                  <div
                    key={b.id}
                    className="card p-5 text-center opacity-50 grayscale"
                  >
                    <div className="text-4xl mb-3">{b.icon}</div>
                    <p className="font-semibold text-ink-primary text-sm">
                      {b.name}
                    </p>
                    <p className="text-xs text-ink-ghost mt-1">{b.desc}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Lock size={10} className="text-ink-ghost" />
                      <p className="text-[10px] text-ink-ghost">Locked</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
