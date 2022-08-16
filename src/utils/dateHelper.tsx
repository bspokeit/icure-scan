/*
 * Copyright (C) 2022 Bspoke IT SRL
 *
 * This file is part of icure-scan.
 *
 * icure-scan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * icure-scan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with icure-scan.  If not, see <http://www.gnu.org/licenses/>.
 */

import { compact } from 'lodash';
import moment from 'moment';

export interface DateStructure {
  year?: number;
  month?: number;
  day?: number;
}

export const yearString2Int = (yearStr: string): number | undefined => {
  if (!yearStr || yearStr.length !== 4) {
    return undefined;
  }

  const yearCandidate = parseInt(yearStr);

  if (isNaN(yearCandidate)) {
    return undefined;
  }

  return yearCandidate;
};

const MONTH_VALUES: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const monthString2Int = (monthStr: string): number | undefined => {
  if (!monthStr || monthStr.length !== 2) {
    return undefined;
  }

  const monthCandidate = parseInt(monthStr);

  if (isNaN(monthCandidate)) {
    return undefined;
  }

  if (!MONTH_VALUES.includes(monthCandidate)) {
    return undefined;
  }

  return monthCandidate;
};

const DAY_VALUES: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
];

export const dayString2Int = (dayStr: string): number | undefined => {
  if (!dayStr || dayStr.length !== 2) {
    return undefined;
  }

  const dayCandidate = parseInt(dayStr);

  if (isNaN(dayCandidate)) {
    return undefined;
  }

  if (!DAY_VALUES.includes(dayCandidate)) {
    return undefined;
  }

  return dayCandidate;
};

export const iCureDateParser = (iCureDate?: number): DateStructure => {
  if (!iCureDate || iCureDate.toString().length !== 8) {
    return {
      year: undefined,
      month: undefined,
      day: undefined,
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

export const parsedDate2String = (parsedDate: DateStructure) => {
  const { year, month, day } = parsedDate;

  if (year) {
    if (month) {
      if (day) {
        return moment(
          `${year.toString().padStart(4, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
          'YYYYMMDD',
        ).format('D MMM YYYY');
      } else {
        return moment(`${year.toString().padStart(4, '0')}${month.toString().padStart(2, '0')}`, 'YYYYMM').format(
          'MMM YYYY',
        );
      }
    } else {
      return moment(`${year.toString().padStart(4, '0')}`, 'YYYY').format('YYYY');
    }
  } else {
    if (month) {
      if (day) {
        return moment(`${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`, 'MMDD').format('D MMM');
      } else {
        return moment(`${month.toString().padStart(2, '0')}`, 'MM').format('MMM');
      }
    } else {
      null;
    }
  }
};

export const parsedDate2Age = (parsedDate: DateStructure) => {
  const { year, month, day } = parsedDate;

  if (year) {
    if (month) {
      if (day) {
        return moment().diff(
          moment(
            `${year.toString().padStart(4, '0')}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`,
            'YYYYMMDD',
          ),
          'years',
        );
      } else {
        return moment().diff(
          moment(`${year.toString().padStart(4, '0')}${month.toString().padStart(2, '0')}`, 'YYYYMM'),
          'years',
        );
      }
    } else {
      return moment().diff(moment(`${year.toString().padStart(4, '0')}`, 'YYYY'), 'years');
    }
  } else {
    if (month) {
      if (day) {
        return moment().diff(
          moment(`${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`, 'MMDD'),
          'years',
        );
      } else {
        return moment().diff(moment(`${month.toString().padStart(2, '0')}`, 'MM'), 'years');
      }
    } else {
      null;
    }
  }
};

export const iCureDateOfBirth = (iCureDate: number) => {
  const parsedDate = iCureDateParser(iCureDate);

  const stringRepresentation = parsedDate2String(parsedDate);

  if (stringRepresentation) {
    return `${stringRepresentation}`;
  } else {
    return ``;
  }
};

export const iCureDateOfBirth2Age = (iCureDate: number) => {
  const parsedDate = iCureDateParser(iCureDate);

  return `${parsedDate2Age(parsedDate)} ans`;
};

export const dateOfBirthInfo = (iCureDate?: number) => {
  const parsedDate = iCureDateParser(iCureDate);

  const dateRepresentation = parsedDate2String(parsedDate);
  const age = parsedDate2Age(parsedDate);
  const ageRepresentation = age ? `${parsedDate2Age(parsedDate)} ans` : null;

  return compact([ageRepresentation, dateRepresentation]).join(' - ');
};
