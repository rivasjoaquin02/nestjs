import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { Coffee } from "./entity/coffee.entity";
import { Flavor } from "./entity/flavor.entity";

@Injectable()
export class CoffeeService {
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepository: Repository<Coffee>,
		@InjectRepository(Flavor)
		private readonly flavorRepository: Repository<Flavor>
	) {}

	async findAll() {
		return await this.coffeeRepository.find({
			relations: ["flavors"]
		});
	}

	async findOne(id: string) {
		const coffee = await this.coffeeRepository.findOne({
			where: { id },
			relations: ["flavors"]
		});
		if (!coffee) throw new NotFoundException(`Coffee #${id} not found`);
		return coffee;
	}

	async create(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
		const flavors = await Promise.all(
			createCoffeeDto.flavors.map((name) =>
				this.preloadFlavorByName(name)
			)
		);

		const coffee = this.coffeeRepository.create({
			...createCoffeeDto,
			flavors
		});

		return await this.coffeeRepository.save(coffee);
	}

	async update(
		id: string,
		updateCoffeeDto: UpdateCoffeeDto
	): Promise<Coffee> {
		const flavors =
			updateCoffeeDto.flavors &&
			(await Promise.all(
				updateCoffeeDto.flavors.map((name) =>
					this.preloadFlavorByName(name)
				)
			));

		const coffee = await this.coffeeRepository.preload({
			id,
			...updateCoffeeDto,
			flavors
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

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFalvor = await this.flavorRepository.findOne({
			where: { name }
		});
		if (existingFalvor) return existingFalvor;
		return this.flavorRepository.create({ name });
	}
}
