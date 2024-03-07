import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../role.decorator";
import { Role } from "../role.enum";
import { AccessControlService } from "src/access-control/access-control.service";
import { JwtPayload } from "../interfaces/jwt";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RoleGqlGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly accessControlService: AccessControlService
	) {}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const requiredRoles = this.getRequiredRoles(ctx);
		if (requiredRoles && requiredRoles.length === 0) return true;

		const request = this.getRequest(ctx);
		const token = request["token"];
		if (!token) throw new UnauthorizedException();

        const a = await token
		console.log(a);

		return requiredRoles.some((role) =>
			this.accessControlService.isAuthorized({
				requieredRole: role,
				currentRole: token.role
			})
		);
	}

	private getRequest(context: GqlExecutionContext) {
		return context.getContext().req;
	}

	private getRequiredRoles(context: GqlExecutionContext): Role[] {
		return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
	}
}
