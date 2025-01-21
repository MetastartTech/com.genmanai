function formatMillisecondsToSeconds(milliseconds: number): number {
  return parseFloat((milliseconds / 1000).toFixed(2));
}

export { formatMillisecondsToSeconds };
