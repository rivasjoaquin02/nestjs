import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn
} from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()
export class Coffee {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	name: string;

	@Column()
	brand: string;

	@Column({ default: 0 })
	recommendations: number;

	@JoinTable()
	@ManyToMany((type) => Flavor, (favor) => favor.coffee, { cascade: true })
	flavors: Flavor[];
}
