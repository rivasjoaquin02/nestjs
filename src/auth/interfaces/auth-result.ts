import { User } from "src/users/entity/user.entity";

export interface AuthResult {
	user: User;
	token: string;
}
