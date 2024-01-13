
export function formatTimer(from: Date, to: Date): string {
  const ms = to.getTime() - from.getTime();
  if(ms < 0)
    throw new Error('Argument exception');
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 6e4) % 60);
  const hours = Math.floor((ms / 3.6e6));
  return `${(''+hours).padStart(2, '0')}:${(''+minutes).padStart(2, '0')}:${(''+seconds).padStart(2, '0')}`;
}
