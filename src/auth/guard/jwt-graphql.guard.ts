import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class JwtGqlGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const request = this.getRequest(ctx);
		const token = this.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException("token error");

		try {
			const payload = this.jwtService.verifyAsync(token, {
				secret: jwtConstants.secret
			});

			request["token"] = payload;
			return true;
		} catch (err) {
			throw new UnauthorizedException("jwt expired");
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	private getRequest(context: GqlExecutionContext): Request {
		const request = context.getContext().req;
		return request;
	}
}
