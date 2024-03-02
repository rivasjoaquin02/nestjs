import { OmitType } from "@nestjs/mapped-types";
import { Role } from "src/auth/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({ type: "varchar", length: 255, unique: true })
	username: string;

	@Column({ type: "varchar" })
	password: string;

	@Column({ type: "varchar", length: 255, unique: true })
	email: string;

	@Column({ type: "int8" })
	age: number;

	@Column({ type: "varchar", default: Role.Guest })
	role: Role;

	@Column({ type: "jsonb", default: [] })
	permissions: string[];
}

export class UserToStore extends OmitType(User, ["id"]) {}
