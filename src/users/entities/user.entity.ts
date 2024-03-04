import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Role } from "src/auth/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn("uuid")
	@Field(() => String)
	id: string;

	@Column({ type: "varchar", length: 100, unique: true })
	@Field(() => String)
	username: string;

	@Column({ type: "varchar" })
	@Field(() => String)
	password: string;

	@Column({ type: "varchar", unique: true })
	@Field(() => String)
	email: string;

	@Column({ type: "int" })
	@Field(() => Int)
	age: number;

	@Column({ type: "varchar" })
	@Field(() => Role, { defaultValue: Role.Guest })
	role: Role;

	@Column({ type: "jsonb" })
	@Field(() => [String])
	permissions: string[];
}
