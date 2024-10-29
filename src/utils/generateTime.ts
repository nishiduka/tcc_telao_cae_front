const timeSeparate = 30;
export const generateTime = (start: string, end: string): string[] => {
  const startTime = start.split(':').map(Number);
  const endTime = end.split(':').map(Number);
  const times = [];
  for (let i = startTime[0]; i < endTime[0]; i++) {
    for (let j = 0; j < 60; j += timeSeparate) {
      times.push(
        `${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`
      );
    }
  }

  return times;
};
