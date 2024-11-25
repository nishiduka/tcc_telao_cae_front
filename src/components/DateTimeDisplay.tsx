import { useEffect, useState } from 'react';

const DateTimeDisplay = ({
  date,
  stopTimer,
  updateDate,
}: {
  date: Date;
  stopTimer: boolean;
  updateDate: (date: Date) => void;
}) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    setDateTime(date);
  }, [date]);

  useEffect(() => {
    let interval = undefined;

    if (stopTimer) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => {
        const now = new Date();
        setDateTime(now);

        if (
          (now.getMinutes() === 0 || now.getMinutes() === 30) &&
          now.getSeconds() === 0
        ) {
          updateDate(now);
        }
      }, 1000);
    }

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [stopTimer, updateDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="d-flex gap-2">
      <h5 className="m-0">
        {formatDate(dateTime).toUpperCase()} - {formatTime(dateTime)}
      </h5>
      {stopTimer && (
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000"
          >
            <path d="m798-274-60-60q11-27 16.5-53.5T760-440q0-116-82-198t-198-82q-24 0-51 5t-56 16l-60-60q38-20 80.5-30.5T480-800q60 0 117.5 20T706-722l56-56 56 56-56 56q38 51 58 108.5T840-440q0 42-10.5 83.5T798-274ZM520-552v-88h-80v8l80 80ZM792-56l-96-96q-48 35-103.5 53.5T480-80q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-60 18.5-115.5T192-656L56-792l56-56 736 736-56 56ZM480-160q42 0 82-13t75-37L248-599q-24 35-36 75t-12 84q0 116 82 198t198 82ZM360-840v-80h240v80H360Zm83 435Zm113-112Z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default DateTimeDisplay;
