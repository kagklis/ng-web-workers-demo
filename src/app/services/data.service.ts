import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { BehaviorSubject, debounceTime, map, Observable } from 'rxjs';

export const INIT_LENGTH = 500;

@Injectable({
   providedIn: 'root',
})
export class DataService {
   private dataLengthSubject = new BehaviorSubject<number>(INIT_LENGTH);
   private dataLength$ = this.dataLengthSubject.asObservable();
   public data$: Observable<ChartData> = this.dataLength$.pipe(
      debounceTime(1_000),
      map((n: number) => this.generateData(n))
   );

   private generateData(n: number): ChartData {
      return {
         labels: [...Array(n).keys()], // x-axis labels
         datasets: [
            {
               label: 'QX',
               data: [...Array(n).keys()],
               backgroundColor: 'orange',
            },
            {
               label: 'QY',
               data: [...Array(n).keys()].reverse(),
               backgroundColor: 'green',
            },
         ],
      };
   }

   public updateDataLength(value: number): void {
      this.dataLengthSubject.next(value);
   }
}
