import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserToStore } from './entities/user';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: Repository<User>) {}

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({where: {email} })
        if (!user) return null
        return user;
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({where: { username} })
        if (!user) return null
        return user;
    }

    async create(user: UserToStore) {
        const userInDb = this.userRepository.create(user)
        return userInDb;
    }
}
