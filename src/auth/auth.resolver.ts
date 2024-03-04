import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginUserInput } from "./dto/login-user.input";
import { LoginResult } from "./types/login-result.type";
import { RegisterUserInput } from "./dto/register-user.input";

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Query(() => LoginResult)
	login(@Args("user") user: LoginUserInput) {
		return this.authService.login(user);
	}

	@Mutation(() => LoginResult)
	register(@Args("user") user: RegisterUserInput) {
		return this.authService.register(user);
	}
}
