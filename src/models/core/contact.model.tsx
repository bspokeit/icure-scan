import { Contact as IcureContact } from '@icure/api';

export class Contact extends IcureContact {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
