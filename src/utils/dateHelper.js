import { compact } from 'lodash';
import moment from 'moment';

export const yearString2Int = (yearStr) => {
  if (!yearStr || yearStr.length !== 4) {
    return null;
  }

  const yearCandidate = parseInt(yearStr);

  if (isNaN(yearCandidate)) {
    return null;
  }

  return yearCandidate;
};

const MONTH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const monthString2Int = (monthStr) => {
  if (!monthStr || monthStr.length !== 2) {
    return null;
  }

  const monthCandidate = parseInt(monthStr);

  if (isNaN(monthCandidate)) {
    return null;
  }

  if (!MONTH_VALUES.includes(monthCandidate)) {
    return null;
  }

  return monthCandidate;
};

const DAY_VALUES = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
];

export const dayString2Int = (dayStr) => {
  if (!dayStr || dayStr.length !== 2) {
    return null;
  }

  const dayCandidate = parseInt(dayStr);

  if (isNaN(dayCandidate)) {
    return null;
  }

  if (!DAY_VALUES.includes(dayCandidate)) {
    return null;
  }

  return dayCandidate;
};

export const iCureDateParser = (iCureDate) => {
  if (!iCureDate || iCureDate.toString().length !== 8) {
    return {
      year: null,
      month: null,
      day: null,
    };
  }

  const strDate = iCureDate.toString();

  const dateCandidate = {
    year: yearString2Int(strDate.substr(0, 4)),
    month: monthString2Int(strDate.substr(4, 2)),
    day: dayString2Int(strDate.substr(6, 2)),
  };

  return dateCandidate;
};

export const parsedDate2String = (parsedDate) => {
  const { year, month, day } = parsedDate;

  if (year) {
    if (month) {
      if (day) {
        return moment(
          `${year.toString().padStart(4, '0')}${month
            .toString()
            .padStart(2, '0')}${day.toString().padStart(2, '0')}`,
          'YYYYMMDD'
        ).format('D MMM YYYY');
      } else {
        return moment(
          `${year.toString().padStart(4, '0')}${month
            .toString()
            .padStart(2, '0')}`,
          'YYYYMM'
        ).format('MMM YYYY');
      }
    } else {
      return moment(`${year.toString().padStart(4, '0')}`, 'YYYY').format(
        'YYYY'
      );
    }
  } else {
    if (month) {
      if (day) {
        return moment(
          `${month.toString().padStart(2, '0')}${day
            .toString()
            .padStart(2, '0')}`,
          'MMDD'
        ).format('D MMM');
      } else {
        return moment(`${month.toString().padStart(2, '0')}`, 'MM').format(
          'MMM'
        );
      }
    } else {
      null;
    }
  }
};

export const parsedDate2Age = (parsedDate) => {
  const { year, month, day } = parsedDate;

  if (year) {
    if (month) {
      if (day) {
        return moment().diff(
          moment(
            `${year.toString().padStart(4, '0')}${month
              .toString()
              .padStart(2, '0')}${day.toString().padStart(2, '0')}`,
            'YYYYMMDD'
          ),
          'years'
        );
      } else {
        return moment().diff(
          moment(
            `${year.toString().padStart(4, '0')}${month
              .toString()
              .padStart(2, '0')}`,
            'YYYYMM'
          ),
          'years'
        );
      }
    } else {
      return moment().diff(
        moment(`${year.toString().padStart(4, '0')}`, 'YYYY'),
        'years'
      );
    }
  } else {
    if (month) {
      if (day) {
        return moment().diff(
          moment(
            `${month.toString().padStart(2, '0')}${day
              .toString()
              .padStart(2, '0')}`,
            'MMDD'
          ),
          'years'
        );
      } else {
        return moment().diff(
          moment(`${month.toString().padStart(2, '0')}`, 'MM'),
          'years'
        );
      }
    } else {
      null;
    }
  }
};

export const iCureDateOfBirth = (iCureDate) => {
  const parsedDate = iCureDateParser(iCureDate);

  const stringRepresentation = parsedDate2String(parsedDate);

  if (stringRepresentation) {
    return `${stringRepresentation}`;
  } else {
    return ``;
  }
};

export const iCureDateOfBirth2Age = (iCureDate) => {
  const parsedDate = iCureDateParser(iCureDate);

  return `${parsedDate2Age(parsedDate)} ans`;
};

export const dateOfBirthInfo = (iCureDate) => {
  const parsedDate = iCureDateParser(iCureDate);

  const dateRepresentation = parsedDate2String(parsedDate);
  const ageRepresentation = `${parsedDate2Age(parsedDate)} ans`;

  return compact([ageRepresentation, dateRepresentation]).join(' - ');
};
