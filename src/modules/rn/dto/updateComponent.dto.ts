import { IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export default class UpdateComponentDTO {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  readonly version: number;
}
