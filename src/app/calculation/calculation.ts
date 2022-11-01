export function calculate(value: number): string | null {
   const start = Date.now();
   // Loop until the required amount of time has passed.
   // Imagine this is the computation causing a major latency.
   while ((Date.now() - start) / 1000 < value);
   return value !== null ? `Some result for value ${value}` : null;
}
