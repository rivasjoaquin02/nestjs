import { registerEnumType } from "@nestjs/graphql";

export enum Role {
	Admin = "admin",
	User = "user",
	Guest = "guest"
}

registerEnumType(Role, { name: "Role", description: "Supported roles" });
