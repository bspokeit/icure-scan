import { User as IcureUser } from '@icure/api';

export class User extends IcureUser {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
