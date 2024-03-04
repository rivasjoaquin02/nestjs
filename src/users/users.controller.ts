import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { Roles } from "src/auth/role.decorator";
import { Role } from "src/auth/role.enum";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { RoleGuard } from "src/auth/guard/role.guard";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@Roles(Role.Admin)
	@UseGuards(JwtGuard, RoleGuard)
	async getAll(): Promise<User[]> {
		return this.userService.findAll();
	}
}
