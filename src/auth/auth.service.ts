import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { AuthResult } from "./interfaces/auth-result";
import { JwtPayload } from "./interfaces/jwt";
import { User, UserToStore } from "src/users/entity/user.entity";
import * as bcrypt from "bcrypt";
import { Role } from "./role.enum";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async login(user: LoginUserDto): Promise<AuthResult | undefined> {
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

	async register(user: RegisterUserDto): Promise<AuthResult> {
		const isInDb = await this.usersService.findByEmail(user.email);
		if (isInDb) throw new ConflictException("The user already exist");

		// hash pass
		const hashedPassword = await this.hashPassword(user.password);
		const userToStore: UserToStore = {
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

	async hashPassword(password: string): Promise<string> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return hashedPassword;
	}

	async comparePassword(
		enteredPassword: string,
		passwordInDb: string
	): Promise<boolean> {
		const match = await bcrypt.compare(enteredPassword, passwordInDb);
		return match;
	}

	async createToken(
		user: User
	): Promise<{ payload: JwtPayload; token: string }> {
		const expiresIn = 30;
		const expiration = new Date();
		expiration.setTime(expiration.getTime() + expiresIn * 1000);

		const payload = {
			sub: user.id,
			username: user.username,
			expiration,
			role: user.role
		};

		const jwt = await this.jwtService.signAsync(payload);
		return { payload, token: jwt };
	}
}
