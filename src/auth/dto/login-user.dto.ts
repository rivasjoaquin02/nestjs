import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    username: string

    @IsString()
    password: string

    @IsString()
    @IsEmail()
    email?: string
}
