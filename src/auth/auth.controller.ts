import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Request,
	UnauthorizedException
} from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { User } from "src/users/entity/user.entity";
import { JwtGuard } from "./guard/jwt.guard";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() user: RegisterUserDto) {
		const result = await this.authService.register(user);
		return result;
	}

	@Post("login")
	async login(@Body() user: LoginUserDto) {
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
