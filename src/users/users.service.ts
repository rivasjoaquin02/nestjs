import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User, UserToStore } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async findByEmail(email: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { email } });
		return user;
	}

	async findByUsername(username: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { username } });
		return user;
	}

	async findById(id: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { id } });
		return user;
	}

	async create(user: UserToStore) {
		const userInDb = this.userRepository.save(user);
		return userInDb;
	}
}
