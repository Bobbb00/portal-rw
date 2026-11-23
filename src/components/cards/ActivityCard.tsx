import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Activity } from "@/types";
import { formatTime, getStatusLabel } from "@/lib/utils";

export default function ActivityCard({ activity }: { activity: Activity }) {
  const dateObj = new Date(activity.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("id-ID", { month: "short" });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Link href={`/agenda/${activity.slug}`} className="block group">
      <div className="card h-full flex flex-col sm:flex-row overflow-hidden">
        {/* Date Calendar Box */}
        <div className="bg-(--color-rw-primary-pale) sm:w-32 flex sm:flex-col items-center justify-center p-4 sm:p-6 text-(--color-rw-primary) group-hover:text-white text-center border-b sm:border-b-0 sm:border-r border-(--color-rw-border) relative overflow-hidden group-hover:bg-(--color-rw-primary) transition-colors">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="relative z-10 flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0">
            <span
              className="text-4xl sm:text-5xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {day}
            </span>
            <span className="text-sm sm:text-base font-medium tracking-wide uppercase opacity-90">
              {month}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 grow flex flex-col">
          <h3
            className="text-lg sm:text-xl font-bold text-(--color-rw-text) group-hover:text-(--color-rw-primary) transition-colors line-clamp-2 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {activity.title}
          </h3>

          <div className="mb-3">
            <span
              className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(activity.status)}`}
            >
              {getStatusLabel(activity.status)}
            </span>
          </div>

          <div className="space-y-2 mt-auto">
            <div className="flex items-start gap-2 text-sm text-(--color-rw-muted)">
              <Clock className="w-4 h-4 mt-0.5 text-(--color-rw-accent) shrink-0" />
              <span>
                {formatTime(activity.startTime)} -{" "}
                {formatTime(activity.endTime)} WIB
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm text-(--color-rw-muted)">
              <MapPin className="w-4 h-4 mt-0.5 text-(--color-rw-accent) shrink-0" />
              <span className="line-clamp-1">{activity.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
