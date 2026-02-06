import * as utils from 'utils';
import {
  format,
  parseISO,
  formatDistance,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  intervalToDuration,
  differenceInYears
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import es from 'date-fns/locale/es';
import moment from 'moment';

export const formatDate = (value?: string) =>
  !value ? '' : format(parseISO(value), 'dd/MM/yyyy', { locale: pt });

export const formatDateHour = (value?: string) =>
  !value ? '' : format(parseISO(value), 'dd/MM/yyyy HH:mm', { locale: pt });

export const formatDateHourByNumber = (value?: string) =>
  !value ? '' : format(Number(value), 'dd/MM/yyyy HH:mm', { locale: pt });

export const formatDateEn = (value?: string) =>
  !value ? '' : format(parseISO(value), 'yyyy-MM-dd');

export const extractHour = (value: string) =>
  !value ? '' : format(parseISO(value), 'HH:mm', { locale: pt });

export const formatDateText = (
  value: string,
  currency: string = utils.currency.BRL
) =>
  !value
    ? ''
    : format(parseISO(value), "dd 'de' MMMM 'de' yyyy", {
        locale: currency === utils.currency.BRL ? pt : es
      });

export const formatDifferenceInYears = (value: string) =>
  !value ? '' : differenceInYears(new Date(), parseISO(value));

export const setHour = (date: any, time: any) => {
  try {
    if (!date) return null;

    if (time && typeof time !== 'string') {
      time = time._d.toISOString();
      time = format(parseISO(time), 'HH:mm');
    }

    if (typeof date !== 'string') date = date._d.toISOString();

    if (!time) time = format(parseISO(date), 'HH:mm');

    const [hour, minute] = time.split(':');
    const newDate = setMilliseconds(
      setSeconds(setMinutes(setHours(parseISO(date), hour), minute), 0),
      0
    );
    return newDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const duration = (s: number) =>
  formatDistance(0, s * 1000, {
    includeSeconds: true,
    locale: pt
  });

export const getPeriod = (value: string) => {
  if (!value) return '';
  const duration = intervalToDuration({
    start: new Date(),
    end: parseISO(value)
  });
  let interval = '';
  if (duration.years! > 0)
    interval += `${duration.years} ano${duration.years! > 1 ? 's' : ''}, `;
  if (duration.months! > 0)
    interval! += `${duration.months} mês${duration.months! > 1 ? 'es' : ''}, `;
  if (duration.days! > 0)
    interval += `${duration.days} dia${duration.days! > 1 ? 's' : ''}`;

  return interval.replace(/, $/, '');
};
