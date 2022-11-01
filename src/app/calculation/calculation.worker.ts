/// <reference lib="webworker" />

import { calculate } from "./calculation";

addEventListener('message', ({ data }) => {
   const response = { result: calculate(data.value) };
   postMessage(response);
});
