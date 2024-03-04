import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces/jwt";
import { User } from "src/users/entities/user.entity";
import * as bcrypt from "bcrypt";
import { Role } from "./role.enum";
import { CreateUserInput } from "src/users/dto/create-user.input";
import { LoginResult } from "./types/login-result.type";
import { RegisterUserInput } from "./dto/register-user.input";
import { LoginUserInput } from "./dto/login-user.input";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async login(user: LoginUserInput): Promise<LoginResult | undefined> {
		const userInDb = user.email
			? await this.usersService.findByEmail(user.email)
			: await this.usersService.findByUsername(user.username);

		if (!userInDb) throw new NotFoundException("The user does not exists");

		const isMatch = await this.comparePassword(
			user.password,
			userInDb.password
		);
		if (!isMatch)
			throw new UnauthorizedException("The password is incorrect");

		const { token } = await this.createToken(userInDb);
		return { user: userInDb, token };
	}

	async register(user: RegisterUserInput): Promise<LoginResult> {
		const isInDb = await this.usersService.findByEmail(user.email);
		if (isInDb) throw new ConflictException("The user already exist");

		// hash pass
		const hashedPassword = await this.hashPassword(user.password);
		const userToStore: CreateUserInput = {
			...user,
			password: hashedPassword,
			role: Role.Guest,
			permissions: []
		};

		// create user
		const userInDb = await this.usersService.create(userToStore);
		const { token } = await this.createToken(userInDb);
		return { user: userInDb, token };
	}

	private hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	private comparePassword(
		enteredPassword: string,
		passwordInDb: string
	): Promise<boolean> {
		return bcrypt.compare(enteredPassword, passwordInDb);
	}

	async createToken(
		user: User
	): Promise<{ payload: JwtPayload; token: string }> {
		const expiresIn = 30 * 60;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);

		const payload: JwtPayload = {
			sub: user.id,
			username: user.username,
			expiration,
			role: user.role,
			permissions: user.permissions
		};

		const token = await this.jwtService.signAsync(payload);
		return { payload, token };
	}
}
