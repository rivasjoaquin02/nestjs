export interface JwtPayload {
	userId: string;
	username: string;
	expiration: Date;
}
