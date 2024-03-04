import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginUserInput {
	@Field(() => String)
	username: string;

	@Field(() => String)
	password: string;

	// TODO: extra checking
	@Field(() => String, { nullable: true })
	email: string;
}
