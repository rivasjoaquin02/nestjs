import { Injectable, NotFoundException } from "@nestjs/common";
import { Coffee } from "./entities/coffee.entity";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";

@Injectable()
export class CoffeeService {
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepository: Repository<Coffee>
	) {}

	async findAll() {
		return await this.coffeeRepository.find();
	}

	async findOne(id: string) {
		const coffee = await this.coffeeRepository.findOne({ where: { id } });
		if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
		return coffee;
	}

	async create(createCoffeeDto: CreateCoffeeDto): Promise<CreateCoffeeDto> {
		await this.coffeeRepository.save(createCoffeeDto);
		return createCoffeeDto;
	}

	async update(
		id: string,
		updateCoffeeDto: UpdateCoffeeDto
	): Promise<Coffee> {
		const coffee = await this.coffeeRepository.preload({
			id,
			...updateCoffeeDto
		});
		if (!coffee) {
			throw new NotFoundException(`Coffee #${id} not found`);
		}
		return this.coffeeRepository.save(coffee);
	}

	async remove(id: string): Promise<Coffee> {
		const coffee = await this.findOne(id);
		return this.coffeeRepository.remove(coffee);
	}
}
