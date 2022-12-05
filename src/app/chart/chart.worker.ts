/// <reference lib="webworker" />

import {
   getNearestElementByX,
   getNearestTouched,
   isTouched,
} from './chart.helper';

importScripts(
   'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
);

declare const Chart: any;

let canvas: any;
let chart: any;
let mouseMoveEnabled: boolean = false;
let mousemoveTimeout: any;

function firstDraw(data: any): void {
   canvas = data.canvas;
   plot(data);
}

function plot(data: any): void {
   const ctx = canvas.getContext('2d');
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   chart = new Chart(canvas, data.chartData);
   canvas.width = data.width;
   canvas.height = data.height;
   chart.resize();
}

function redraw(data: any): void {
   chart.destroy();
   plot(data);
}

function resize(data: any): void {
   canvas.width = data.width;
   canvas.height = data.height;
   chart.resize();
}

function mousemove(data: any): void {
   if (!mouseMoveEnabled) return;
   clearTimeout(mousemoveTimeout);
   mousemoveTimeout = setTimeout(() => {
      const tooltip = chart.tooltip;
      const mousePoint = { x: data.x, y: data.y };
      const nearest1 = getNearestElementByX(chart.getDatasetMeta(0), mousePoint);
      const nearest2 = getNearestElementByX(chart.getDatasetMeta(1), mousePoint);
      if (!isTouched(nearest1, mousePoint) && !isTouched(nearest2, mousePoint)) {
         tooltip.setActiveElements([]);
      } else {
         const nearest = getNearestTouched(nearest1, nearest2, mousePoint);
         tooltip.setActiveElements([nearest]);
      }
      chart.update();
   }, 500)
}

function mouseenter(): void {
   mouseMoveEnabled = true;
}

function mouseleave(): void {
   mouseMoveEnabled = false;
   clearTimeout(mousemoveTimeout);
   const tooltip = chart.tooltip;
   tooltip.setActiveElements([]);
   chart.update();
}

const handlers = {
   firstDraw,
   redraw,
   resize,
   mousemove,
   mouseenter,
   mouseleave,
};

addEventListener('message', ({ data }) => {
   const fn = handlers[data.type as keyof typeof handlers];
   if (!fn) {
      throw new Error('No handler registered for type: ' + data.type);
   }
   fn(data);
   postMessage({});
});
