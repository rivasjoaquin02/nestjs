import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../role.decorator";
import { Role } from "../role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (!roles || roles.length === 0) return true;

		const { user } = context.switchToHttp().getRequest();
		return roles.some((role) => user.roles?.includes(role));
	}
}
