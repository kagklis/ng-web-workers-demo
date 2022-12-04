/// <reference lib="webworker" />

importScripts(
   'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
);

declare const Chart: any;

let canvas: any;
let chart: any;

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

const handlers = {
   firstDraw,
   redraw,
   resize,
};

addEventListener('message', ({ data }) => {
   const fn = handlers[data.type as keyof typeof handlers];
   if (!fn) {
      throw new Error('No handler registered for type: ' + data.type);
   }
   fn(data);
   postMessage({});
});
