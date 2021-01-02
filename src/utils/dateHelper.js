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

  if (MONTH_VALUES.includes(monthCandidate)) {
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

  if (DAY_VALUES.includes(dayCandidate)) {
    return null;
  }

  return dayCandidate;
};

export const dateIsValid = (candidate) => {
  return (
    candidate &&
    candidate.year &&
    candidate.month &&
    candidate.day &&
    moment(
      `${dateCandidate.year}${dateCandidate.month}${dateCandidate.day}`,
      'YYYYMMDD'
    ).isValid()
  );
};

export const iCureDate2PartialDate = (iCureDate) => {
  if (!iCureDate || iCureDate.toString().length !== 8) {
    return null;
  }

  const strDate = iCureDate.toString();

  const dateCandidate = {
    year: yearString2Int(strDate.substr(0, 3)),
    month: monthString2Int(strDate.substr(4, 5)),
    day: dayString2Int(strDate.substr(6, 7)),
  };

  if (dateIsValid(dateCandidate)) {
    dateCandidate.date = new Date(
      `${dateCandidate.year}-${dateCandidate.month}-${dateCandidate.day}`
    );
  }

  return dateCandidate;
};
