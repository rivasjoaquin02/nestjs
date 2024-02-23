import { OmitType} from "@nestjs/mapped-types";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string

    @Column({ type: "varchar", length: 255,  unique: true})
    username: string

    @Column()
    password: string

    @Column({ type: "varchar", length: 255,  unique: true})
    email: string

    @Column()
    age: number
}

export class UserToStore extends OmitType(User, ["id"]) {}

