import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Version, InsertComponent } from './types';

@Injectable()
export class RNService {
  constructor(
    @InjectModel('Version') private readonly versionModel: Model<Version>,
  ) {}

  insertOneComponent(model: InsertComponent) {
    new this.versionModel({
      ...model,
    }).save();
  }

  findAllNewestComponentByCommonHash() {
    return {};
  }
}
