"use client";

/**
 * Transition selector component
 * Allows users to choose the transition effect between images
 */

import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";
import type { TransitionType } from "../../types";

const TRANSITIONS: Array<{
  value: TransitionType;
  label: string;
  description: string;
}> = [
  {
    value: "fade",
    label: "Fade (Cross-dissolve)",
    description: "Smooth crossfade between images",
  },
  {
    value: "fadeToBlack",
    label: "Fade to Black",
    description: "Fade out to black, then fade in next image",
  },
  {
    value: "wipeLeft",
    label: "Wipe Left-to-Right",
    description: "Next image wipes from left to right",
  },
  {
    value: "wipeUp",
    label: "Wipe Up-to-Down",
    description: "Next image wipes from top to bottom",
  },
];

export function TransitionSelector() {
  const transitionType = useAppStore((state) => state.settings.transitionType);
  const setTransitionType = useAppStore((state) => state.setTransitionType);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTransitionType(event.target.value as TransitionType);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="transition-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Transition Effect
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Choose how images transition during the video
      </p>

      <select
        id="transition-select"
        value={transitionType}
        onChange={handleChange}
        className={cn(
          "w-full px-4 py-2 rounded-lg",
          "border border-gray-300 dark:border-gray-600",
          "bg-white dark:bg-gray-800",
          "text-gray-900 dark:text-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "cursor-pointer"
        )}
      >
        {TRANSITIONS.map((transition) => (
          <option key={transition.value} value={transition.value}>
            {transition.label}
          </option>
        ))}
      </select>

      {/* Display description of selected transition */}
      <p className="text-xs text-gray-600 dark:text-gray-400 italic">
        {TRANSITIONS.find((t) => t.value === transitionType)?.description}
      </p>
    </div>
  );
}
