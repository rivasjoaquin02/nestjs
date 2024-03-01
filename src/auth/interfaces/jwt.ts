import { Role } from "../role.enum";

export interface JwtPayload {
	sub: string;
	username: string;
	expiration: Date;
	role: Role;
}
