import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UseGuards } from "@nestjs/common";
import { JwtGqlGuard } from "src/auth/guard/jwt-graphql.guard";
import { Roles } from "src/auth/role.decorator";
import { Role } from "src/auth/role.enum";
import { RoleGqlGuard } from "src/auth/guard/role-graphql.guard";

@Resolver(() => User)
export class UsersResolver {
	constructor(private readonly userService: UsersService) {}

	@Query(() => [User], { name: "findAllUsers" })
	@Roles(Role.Guest)
	@UseGuards(JwtGqlGuard, RoleGqlGuard)
	findAll() {
		return this.userService.findAll();
	}

	@Query(() => User, { name: "findUserById" })
	findById(@Args("id", { type: () => String }) id: string) {
		return this.userService.findById(id);
	}

	@Query(() => User, { name: "findUserByEmail" })
	findByEmail(@Args("email", { type: () => String }) email: string) {
		return this.userService.findByEmail(email);
	}

	@Mutation(() => User, { name: "addUser" })
	create(
		@Args("user", { type: () => CreateUserInput }) user: CreateUserInput
	): Promise<User> {
		return this.userService.create(user);
	}

	@Mutation(() => User, { name: "removeUserById" })
	remove(@Args("id", { type: () => String }) id: string): Promise<User> {
		return this.userService.removeById(id);
	}

	@Mutation(() => User, { name: "updateUserById" })
	update(
		@Args("user", { type: () => UpdateUserInput }) user: UpdateUserInput
	): Promise<User> {
		return this.userService.update(user);
	}
}
