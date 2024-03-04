import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateUserInput } from "./create-user.input";
import { Role } from "src/auth/role.enum";

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
	@Field(() => String)
	id: string;

	@Field(() => String, { nullable: true })
	username: string;

	@Field(() => String, { nullable: true })
	password: string;

	@Field(() => String, { nullable: true })
	email: string;

	@Field(() => Role, { nullable: true })
	role: Role;

	@Field(() => [String], { nullable: true })
	permissions: string[];
}
