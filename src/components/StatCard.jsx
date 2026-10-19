import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-[#2F6FDE]',
      glow: 'hover:border-blue-400/40 dark:hover:border-blue-500/40'
    },
    emerald: {
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      glow: 'hover:border-emerald-400/40 dark:hover:border-emerald-500/40'
    },
    amber: {
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      glow: 'hover:border-amber-400/40 dark:hover:border-amber-500/40'
    },
    rose: {
      iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
      glow: 'hover:border-rose-400/40 dark:hover:border-rose-500/40'
    },
    purple: {
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      glow: 'hover:border-purple-400/40 dark:hover:border-purple-500/40'
    }
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-[#0D1B34] border border-slate-200/90 dark:border-[#1B2C4D] shadow-sm hover:shadow-md transition-all duration-200 ${selectedColor.glow}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8FA3C4]">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${selectedColor.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-[#E6ECF7]">
          {value}
        </h3>
      </div>

      {(change !== undefined || subtitle) && (
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {change !== undefined && (
            <div className={`flex items-center font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              <span>{change}</span>
              <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal">vs last month</span>
            </div>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-[#8FA3C4] text-[11px] truncate max-w-[150px]">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
