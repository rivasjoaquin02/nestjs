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
		if (!user) return null;
		return user;
	}

	async findByUsername(username: string): Promise<User | undefined> {
		const user = await this.userRepository.findOne({ where: { username } });
		if (!user) return null;
		return user;
	}

	async create(user: UserToStore) {
		const userInDb = this.userRepository.save(user);
		return userInDb;
	}
}
