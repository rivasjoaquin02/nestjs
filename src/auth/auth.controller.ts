import {
	Body,
	Controller,
	Get,
	Post,
	UseGuards,
	Request
} from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { AuthGuard } from "./auth.guard";

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

	@UseGuards(AuthGuard)
	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
