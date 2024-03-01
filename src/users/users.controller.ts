import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "./entity/user.entity";
import { UsersService } from "./users.service";
import { Roles } from "src/auth/role.decorator";
import { Role } from "src/auth/role.enum";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { RoleGuard } from "src/auth/guard/role.guard";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get()
	@UseGuards([JwtGuard, RoleGuard])
	@Roles(Role.Admin)
	async getAll(): Promise<User[]> {
		return this.userService.getAll();
	}
}
