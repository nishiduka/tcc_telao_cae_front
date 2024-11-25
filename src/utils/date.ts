export const getDayName = (date: Date) => {
  const daysOfWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const dayIndex = date.getDay();

  return daysOfWeek[dayIndex];
};

export const formatHour = (hour: string) => {
  const [hourString, minuteString] = hour.split(':');
  const hourNumber = parseInt(hourString);
  const minuteNumber = parseInt(minuteString);

  const hourFormatted = hourNumber.toString().padStart(2, '0');
  const minuteFormatted = minuteNumber.toString().padStart(2, '0');

  return `${hourFormatted}:${minuteFormatted}`;
};
