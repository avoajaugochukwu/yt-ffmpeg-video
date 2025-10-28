/**
 * Performance logging utility for tracking operation timings
 */

interface TimingEntry {
  name: string;
  duration: number;
  children?: TimingEntry[];
}

interface TimerState {
  startTime: number;
  children: TimingEntry[];
}

export class PerformanceLogger {
  private startTime: number = 0;
  private timings: TimingEntry[] = [];
  private activeTimers: Map<string, TimerState> = new Map();
  private prefix: string;

  constructor(prefix: string = "[Timer]") {
    this.prefix = prefix;
  }

  /**
   * Start the overall performance tracking
   */
  start(): void {
    this.startTime = performance.now();
    this.timings = [];
    this.activeTimers.clear();
  }

  /**
   * Start timing a specific step
   * @param stepName - Name of the step to time
   */
  startStep(stepName: string): void {
    this.activeTimers.set(stepName, {
      startTime: performance.now(),
      children: [],
    });
  }

  /**
   * Start timing a sub-operation within a step
   * @param parentStep - Name of the parent step
   * @param subStepName - Name of the sub-step to time
   */
  startSubStep(parentStep: string, subStepName: string): void {
    const key = `${parentStep}:${subStepName}`;
    this.activeTimers.set(key, {
      startTime: performance.now(),
      children: [],
    });
  }

  /**
   * Stop timing a step and record the duration
   * @param stepName - Name of the step to stop timing
   * @param log - Whether to log to console (default: true)
   * @returns Duration in seconds
   */
  stopStep(stepName: string, log: boolean = true): number {
    const timer = this.activeTimers.get(stepName);
    if (!timer) {
      console.warn(`${this.prefix} No active timer found for: ${stepName}`);
      return 0;
    }

    const duration = (performance.now() - timer.startTime) / 1000;
    const entry: TimingEntry = {
      name: stepName,
      duration,
      children: timer.children.length > 0 ? timer.children : undefined,
    };

    this.timings.push(entry);
    this.activeTimers.delete(stepName);

    if (log) {
      this.logStep(stepName, duration, entry.children);
    }

    return duration;
  }

  /**
   * Stop timing a sub-step and add it to the parent's children
   * @param parentStep - Name of the parent step
   * @param subStepName - Name of the sub-step to stop timing
   * @param log - Whether to log to console (default: true)
   * @returns Duration in seconds
   */
  stopSubStep(
    parentStep: string,
    subStepName: string,
    log: boolean = true
  ): number {
    const key = `${parentStep}:${subStepName}`;
    const timer = this.activeTimers.get(key);
    if (!timer) {
      console.warn(`${this.prefix} No active timer found for: ${key}`);
      return 0;
    }

    const duration = (performance.now() - timer.startTime) / 1000;
    const parentTimer = this.activeTimers.get(parentStep);
    if (parentTimer) {
      parentTimer.children.push({
        name: subStepName,
        duration,
      });
    }

    this.activeTimers.delete(key);

    if (log) {
      console.log(`${this.prefix}   - ${subStepName}: ${duration.toFixed(2)}s`);
    }

    return duration;
  }

  /**
   * Complete the performance tracking and log summary
   * @returns Total duration in seconds
   */
  end(): number {
    const totalDuration = (performance.now() - this.startTime) / 1000;

    console.log(`${this.prefix} ${"=".repeat(50)}`);
    console.log(`${this.prefix} Total Time: ${totalDuration.toFixed(2)}s`);
    console.log(`${this.prefix} ${"=".repeat(50)}`);

    return totalDuration;
  }

  /**
   * Get all timing data
   * @returns Array of timing entries
   */
  getTimings(): TimingEntry[] {
    return this.timings;
  }

  /**
   * Get total elapsed time
   * @returns Total duration in seconds
   */
  getTotalDuration(): number {
    return (performance.now() - this.startTime) / 1000;
  }

  /**
   * Log a step's timing to console
   */
  private logStep(
    stepName: string,
    duration: number,
    children?: TimingEntry[]
  ): void {
    console.log(`${this.prefix} ${stepName} - ${duration.toFixed(2)}s`);

    if (children && children.length > 0) {
      children.forEach((child) => {
        console.log(
          `${this.prefix}   - ${child.name}: ${child.duration.toFixed(2)}s`
        );
      });
    }
  }
}
