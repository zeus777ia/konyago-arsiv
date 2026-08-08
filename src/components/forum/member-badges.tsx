import { Award, Frame } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_ACTIVITY,
  formatActiveDuration,
  getFrame,
  getRank,
  normalizeActivity,
  type MemberActivity,
  type RankDef,
  type FrameDef,
} from "@/lib/members/ranks";

export function RankBadge({
  activity,
  className,
  showIcon = true,
}: {
  activity?: Partial<MemberActivity> | null;
  className?: string;
  showIcon?: boolean;
}) {
  const a = normalizeActivity(activity ?? DEFAULT_ACTIVITY);
  const rank = getRank(a.totalMinutes);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        rank.className,
        className,
      )}
      title={`${rank.description} · ${formatActiveDuration(a.totalMinutes)} aktif`}
    >
      {showIcon && <Award className="size-2.5 shrink-0" aria-hidden />}
      {rank.label}
    </span>
  );
}

export function FrameBadge({
  activity,
  className,
}: {
  activity?: Partial<MemberActivity> | null;
  className?: string;
}) {
  const a = normalizeActivity(activity ?? DEFAULT_ACTIVITY);
  const frame = getFrame(a);
  if (frame.id === "none") return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-fg",
        className,
      )}
      title={frame.description}
    >
      <Frame className="size-2.5 shrink-0 text-accent" aria-hidden />
      {frame.label}
    </span>
  );
}

export function ActivityProgress({
  activity,
  rank,
  frame,
  nextR,
  nextF,
}: {
  activity: MemberActivity;
  rank: RankDef;
  frame: FrameDef;
  nextR: RankDef | null;
  nextF: FrameDef | null;
}) {
  return (
    <div className="space-y-3 text-xs text-muted">
      <div className="flex flex-wrap gap-2">
        <RankBadge activity={activity} />
        <FrameBadge activity={activity} />
      </div>
      <p>
        Toplam aktif:{" "}
        <strong className="text-fg">
          {formatActiveDuration(activity.totalMinutes)}
        </strong>
        {" · "}
        Bugün:{" "}
        <strong className="text-fg">
          {formatActiveDuration(activity.dayMinutes)}
        </strong>
        {" · "}
        Aktif gün: <strong className="text-fg">{activity.activeDays}</strong>
        {activity.streakDays > 1 && (
          <>
            {" · "}
            Seri: <strong className="text-fg">{activity.streakDays} gün</strong>
          </>
        )}
      </p>
      {nextR && (
        <p>
          Sonraki rozet <strong className="text-fg">{nextR.label}</strong>:{" "}
          {formatActiveDuration(
            Math.max(0, nextR.minMinutes - activity.totalMinutes),
          )}{" "}
          kaldı
        </p>
      )}
      {nextF && (
        <p>
          Sonraki çerçeve <strong className="text-fg">{nextF.label}</strong>:{" "}
          {formatActiveDuration(
            Math.max(0, nextF.minHours * 60 - activity.totalMinutes),
          )}{" "}
          + en az {nextF.minActiveDays} aktif gün (şu an {activity.activeDays})
        </p>
      )}
      {!nextR && !nextF && (
        <p className="text-primary">Tüm kademe ve çerçeveler açıldı.</p>
      )}
      <p className="text-[11px] text-subtle">
        Süre, oturum açık ve sayfa görünürken sayılır. Mevcut rozet: {rank.label}
        {frame.id !== "none" ? ` · ${frame.label}` : ""}.
      </p>
    </div>
  );
}
