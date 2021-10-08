import { IsString, IsOptional, IsIn } from 'class-validator';

export default class CheckUpdateDTO {
  @IsString()
  @IsIn(['ios', 'android'])
  readonly platform: string;

  @IsOptional()
  @IsString()
  readonly commonHash?: string;
}
