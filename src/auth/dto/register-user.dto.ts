import { IsEmail, IsNumber, IsString } from "class-validator";

export class RegisterUserDto {
	@IsString()
	username: string;

	@IsString()
	password: string;

	@IsString()
	@IsEmail()
	email: string;

	@IsNumber()
	age: number;
}
