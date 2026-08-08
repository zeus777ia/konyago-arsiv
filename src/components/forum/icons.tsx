import {
  BookOpen,
  Building2,
  Bus,
  Calendar,
  Camera,
  Flame,
  Landmark,
  LifeBuoy,
  Map,
  Megaphone,
  MessagesSquare,
  Newspaper,
  Route,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  flame: Flame,
  landmark: Landmark,
  "book-open": BookOpen,
  map: Map,
  "building-2": Building2,
  route: Route,
  utensils: Utensils,
  calendar: Calendar,
  bus: Bus,
  camera: Camera,
  newspaper: Newspaper,
  "messages-square": MessagesSquare,
  "life-buoy": LifeBuoy,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = MAP[name] ?? MessagesSquare;
  return <Icon className={className} strokeWidth={1.75} />;
}
