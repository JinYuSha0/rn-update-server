import { IsString, IsOptional } from 'class-validator';

export default class CheckUpdateDTO {
  @IsOptional()
  @IsString()
  readonly commonHash?: string;
}
