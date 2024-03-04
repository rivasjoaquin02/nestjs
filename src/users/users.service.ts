import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	findByEmail(email: string): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { email } });
	}

	findByUsername(username: string): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { username } });
	}

	findById(id: string): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { id } });
	}

	create(user: CreateUserInput): Promise<User> {
		const userToInsert = this.userRepository.create(user);
		return this.userRepository.save(userToInsert);
	}

	async removeById(id: string): Promise<User> {
		const userToRemove = await this.findById(id);
		return this.userRepository.remove(userToRemove);
	}

	async update(user: UpdateUserInput): Promise<User> {
		await this.userRepository.update(user.id, user);
		return this.findById(user.id);
	}
}
