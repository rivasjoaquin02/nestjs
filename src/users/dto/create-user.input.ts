import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { Role } from "src/auth/role.enum";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends PartialType(User) {
	@Field(() => String)
	username: string;

	@Field(() => String)
	email: string;

	@Field(() => String)
	password: string;

	@Field(() => Int)
	age: number;

	@Field(() => Role)
	role: Role; //TODO: change type to enum Role

	@Field(() => [String])
	permissions: string[];
}
