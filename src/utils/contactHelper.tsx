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

import _ from 'lodash';
import { DOCUMENT_SERVICE_TAGS } from '../constant';
import { Contact, Service } from '../models';

export const extractContactServices = (contact: Contact): Service[] => {
  if (!contact || !contact.services || !contact.services.length) {
    return [];
  }

  const docServices = _.filter(contact.services || [], s => {
    return (
      !!s &&
      !!s.id &&
      !!s.tags &&
      s.tags.length >= 2 &&
      DOCUMENT_SERVICE_TAGS.every(docTag => {
        return _.findIndex(s.tags, t => t.type === docTag.type && t.code === docTag.code) > -1;
      })
    );
  });

  return docServices as Service[];
};

export const extractDocumentIdFromService = (service: Service): string | undefined => {
  return service?.content?.fr?.documentId ?? undefined;
};
