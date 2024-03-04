import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../role.decorator";
import { Role } from "../role.enum";
import { AccessControlService } from "src/access-control/access-control.service";
import { JwtPayload } from "../interfaces/jwt";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly accessControlService: AccessControlService
	) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()]
		);
		if (requiredRoles && requiredRoles.length === 0) return true;

		const request = this.getRequest(context);
		const token = request["token"] as JwtPayload;

		return requiredRoles.some((role) =>
			this.accessControlService.isAuthorized({
				requieredRole: role,
				currentRole: token.role
			})
		);
	}

	private getRequest(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		return request;
	}
}
