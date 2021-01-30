import { Service as IcureService } from '@icure/api';

export class Service extends IcureService {
  id: string;

  constructor(json: JSON | any) {
    super(json);
    this.id = json.id!!;
  }
}
