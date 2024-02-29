export interface JwtPayload {
	sub: string;
	username: string;
	expiration: Date;
}
