import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Request,
	UnauthorizedException
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "src/users/entities/user.entity";
import { JwtGuard } from "./guard/jwt.guard";
import { LoginUserInput } from "./dto/login-user.input";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() user) {
		const result = await this.authService.register(user);
		return result;
	}

	@Post("login")
	async login(@Body() user: LoginUserInput) {
		const result = await this.authService.login(user);
		return result;
	}

	@UseGuards(JwtGuard)
	@Get("profile")
	getProfile(@Request() request) {
		return request.user;
	}

	@Get("refreshToken")
	@UseGuards(JwtGuard)
	async refreshToken(@Request() request): Promise<string> {
		const user: User = request.user;
		if (!user)
			throw new UnauthorizedException(
				"Could not log-in with the provided credentials"
			);

		const result = await this.authService.createToken(user);
		if (!result)
			throw new UnauthorizedException(
				"Could not log-in with the provided credentials"
			);

		return result.token;
	}
}
