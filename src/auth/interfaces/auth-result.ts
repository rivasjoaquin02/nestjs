import { User } from "src/users/entities/user";

export interface AuthResult {
    user: User
    token: string
}
