import { Component, OnDestroy } from '@angular/core';
import { calculate } from './calculation';

@Component({
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent implements OnDestroy {
  public value!: number;
  public result!: string | null;
  public isCalculating: boolean = false;

  private currentWorker!: Worker;

  ngOnDestroy(): void {
    this.terminateRunningWorker();
  }

  public modelChange(newValue: number): void {
    this.value = newValue;
    this.result = null;
    if (newValue <= 0) {
      this.terminateRunningWorker();
      return;
    }
    const start = performance.now();
    this.runCalculation();
    console.log(`Blocked UI for ${performance.now() - start} ms`);
  }

  private runCalculation(): void {
    if (typeof Worker !== undefined) {
      this.terminateRunningWorker();
      this.invokeNewWorker(this.value);
    } else {
      console.error('Web workers not supported! Calling on main thread...');
      this.result = calculate(this.value);
    }
  }

  private invokeNewWorker(value: number): void {
    this.currentWorker = new Worker(
      new URL('./calculation.worker', import.meta.url)
    );
    this.isCalculating = true;
    this.currentWorker.onmessage = ({ data }) => {
      this.result = data.result;
      this.isCalculating = false;
    };
    this.currentWorker.postMessage({ value });
  }

  private terminateRunningWorker(): void {
    this.currentWorker?.terminate();
    this.isCalculating = false;
  }
}
