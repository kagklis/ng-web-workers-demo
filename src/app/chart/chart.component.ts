import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartConfiguration } from 'chart.js';
import { Subscription } from 'rxjs';
import { DataService, INIT_LENGTH } from '../services/data.service';

@Component({
   templateUrl: './chart.component.html',
   styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
   @ViewChild('chartCanvas') chartCanvas!: any;

   public dataLength: number = INIT_LENGTH;
   public isLoading: boolean = true;
   public chart!: Chart;

   private dataSubscription!: Subscription;
   private currentWorker!: Worker;
   private get size() {
      return {
         width: (3 * window.innerWidth) / 4,
         height: (3 * window.innerHeight) / 4,
      };
   }

   constructor(private dataService: DataService) {}
   ngAfterViewInit(): void {
      this.dataSubscription = this.dataService.data$.subscribe(
         (data: ChartData) => {
            if (typeof Worker !== undefined) {
               this.renderWithWorker(data);
            } else {
               this.renderChart(data);
               this.isLoading = false;
            }
         }
      );
   }

   ngOnDestroy(): void {
      this.dataSubscription.unsubscribe();
      this.currentWorker?.terminate();
      this.dataService.updateDataLength(INIT_LENGTH);
   }

   public modelChange(newValue: number): void {
      this.dataLength = newValue;
      this.isLoading = true;
      this.dataService.updateDataLength(newValue);
   }

   private renderChart(data: ChartData): void {
      if (this.chart) {
         this.chart.destroy();
      }
      this.chart = new Chart('myChart', this.getChartPayload(data));
   }

   private renderWithWorker(data: ChartData) {
      const payload = this.getChartPayload(data);
      if (!this.currentWorker) {
         this.initWorker();
         this.firstDraw(payload);
         this.registerResizeEvents();
      } else {
         this.redraw(payload);
      }
   }

   private getChartPayload(data: ChartData): ChartConfiguration {
      return {
         type: 'bar',
         data,
         options: {
            aspectRatio: 2.5,
            responsive: true,
         },
      };
   }

   private initWorker(): void {
      this.currentWorker = new Worker(
         new URL('./chart.worker', import.meta.url)
      );

      this.currentWorker.onmessage = () => {
         this.isLoading = false;
      };
   }

   private firstDraw(chartData: ChartConfiguration): void {
      const offscreen = this.createCanvas();
      this.currentWorker.postMessage(
         {
            type: 'firstDraw',
            canvas: offscreen,
            ...this.size,
            chartData,
         },
         [offscreen]
      );
   }

   private createCanvas() {
      const currentCanvas = document.createElement('canvas');
      document.getElementById('chartCanvas')?.append(currentCanvas);
      return (currentCanvas as any).transferControlToOffscreen();
   }

   private redraw(chartData: ChartConfiguration): void {
      this.currentWorker.postMessage({
         type: 'redraw',
         ...this.size,
         chartData,
      });
   }

   private registerResizeEvents(): void {
      const worker = this.currentWorker;
      function windowResize(): void {
         worker.postMessage({
            type: 'resize',
            width: (3 * window.innerWidth) / 4,
            height: (3 * window.innerHeight) / 4,
         });
      }
      window.addEventListener('resize', windowResize);
   }
}
