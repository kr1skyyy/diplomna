const oneDayMilisec = 1000 * 60 * 60 * 24;

export const getWeekOfYear = (date: Date): number => {
  const today = new Date(+date);
  today.setHours(0,0,0);
  today.setDate(today.getDate()+4-(today.getDay()||7));
  const firstDayOfYear = new Date(today.getFullYear(),0,1);
  return Math.ceil(((( (today as any) - (firstDayOfYear as any) )/8.64e7)+1)/7);
};

export const getStartOfWeekDay = (today: Date): Date => {
  return new Date(
    today.getTime() + (oneDayMilisec * (-7 - today.getDate()))
    );
  };
  
  export const getEndOfWeekDay = (today: Date): Date => {
    return new Date(
      today.getTime() + (oneDayMilisec * ((7 - today.getDate()) - 1))
      );
    };
    
    export const getStartOfMonth = (today: Date): Date => {
      const startOfMonth = new Date();
      startOfMonth.setFullYear(today.getFullYear(), today.getMonth(), 1);

  return startOfMonth;
};

export const getEndOfMonth = (today: Date): Date => {
  const endOfMonth = new Date();
  endOfMonth.setFullYear(today.getFullYear(), today.getMonth() + 1, 0);
  
  return endOfMonth;
};

export const getWeekChart = (today) => {
  const weekDay = getWeekOfYear(today);

  return {
    id: `${weekDay}week${today.getFullYear()}`,
    name: `Week ${weekDay} top chart`,
    from: getStartOfWeekDay(today),
    to: getEndOfWeekDay(today),
  };
};

export const getMongthChart = (today) => {
  return {
    id: `${today.getMonth() + 1}month${today.getFullYear()}`,
    name: `Month ${today.getMonth() + 1} top chart`,
    from: getStartOfMonth(today),
    to: getEndOfMonth(today),
  };
};

export const getYearChart = (today) => {
  return {
    id: `${today.getFullYear()}`,
    name: `Year ${today.getFullYear()} top chart`,
    from: new Date(today.getFullYear(), 1, 1),
    to: new Date(today.getFullYear(), 11, 31),
  };
};

export default function getCharts() {
  const today = new Date();

  const weekChart = getWeekChart(today);
  const monthChart = getMongthChart(today);
  const yearChart = getYearChart(today);

  return [weekChart, monthChart, yearChart];
};