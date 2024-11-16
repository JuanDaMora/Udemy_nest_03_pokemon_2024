import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
  //isInt, IsPositive, min 1
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  //isString, minLength  1
  @IsString()
  @MinLength(1)
  name: string;
}
