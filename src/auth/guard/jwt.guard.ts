import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = this.getRequest(context);
		const token = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException("token must be Beader");

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret
			});

			// with this you can access it in a route handler
			request["token"] = payload;
		} catch (err) {
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	private getRequest(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		return request;
	}
}
