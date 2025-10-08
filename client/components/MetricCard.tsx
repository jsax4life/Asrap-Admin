import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function MetricCard({ icon: Icon, value, label }: MetricCardProps) {
  return (
    <div className="w-full lg:w-[250px] h-[120px] rounded-[10px] bg-asra-gray-1 shadow-[0_2px_4px_rgba(30,30,30,0.12)] flex items-center px-4 lg:px-5 gap-3 lg:gap-4">
      <div className="w-[50px] h-[50px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <Icon className="w-[29px] h-[29px] text-white" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1 lg:gap-2">
        <div className="text-white text-2xl lg:text-[28px] font-bold leading-8">{value}</div>
        <div className="text-white text-xs font-bold tracking-[0.24px] leading-4">{label}</div>
      </div>
    </div>
  );
}
