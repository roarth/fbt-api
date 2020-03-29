import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class AuthCredentialsDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'Password too weak!' },
  )
  password: string;
}
