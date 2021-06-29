// Using ApiProperty decorator:
// import { ApiProperty } from '@nestjs/swagger';

// export class CreateCatDto {
//   @ApiProperty()
//   name: string;

//   @ApiProperty({
//     description: 'The age of a cat',
//     minimum: 1,
//     default: 1,
//   })
//   age: number;

//   @ApiProperty()
//   breed: string;
// }

// Avoid ApiProperty decorator:
export class CreateCatDto {
  name: string;
  /**
   * The age of the cat
   * @example 5
   */
  age: number = 1;
  breed?: string;
}