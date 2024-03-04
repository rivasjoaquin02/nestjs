import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "src/users/dto/create-user.input";
import { Role } from "../role.enum";

@InputType()
export class RegisterUserInput extends PartialType(CreateUserInput) {
	@Field(() => String)
	username: string;

	@Field(() => String)
	password: string;

	@Field(() => String)
	email: string;

	@Field(() => Int)
	age: number;

	@Field(() => Role, { nullable: true })
	role?: Role;

	@Field(() => String, { nullable: true })
	permissions?: string[];
}
