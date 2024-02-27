import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { Coffee } from "./entity/coffee.entity";
import { Flavor } from "./entity/flavor.entity";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { Event } from "src/events/entities/event.entity";
import { COFFEE_BRANDS } from "./coffee.constants";

@Injectable({ scope: Scope.REQUEST })
export class CoffeeService {
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepository: Repository<Coffee>,
		@InjectRepository(Flavor)
		private readonly flavorRepository: Repository<Flavor>,
		private readonly dataSource: DataSource,
		@Inject(COFFEE_BRANDS) coffeeBrands: string[]
	) {
		console.log("CoffeeService is Instanciated");
	}

	async findAll(paginationQuery: PaginationQueryDto) {
		const { offset, limit } = paginationQuery;
		return await this.coffeeRepository.find({
			relations: ["flavors"],
			skip: offset,
			take: limit
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

	async recommendCoffee(coffee: Coffee) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			coffee.recommendations++;

			const recommendEvent = new Event();
			recommendEvent.name = "recommend_coffee";
			recommendEvent.type = "coffee";
			recommendEvent.payload = { coffeeId: coffee.id };

			await queryRunner.manager.save(coffee);
			await queryRunner.manager.save(recommendEvent);

			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFalvor = await this.flavorRepository.findOne({
			where: { name }
		});
		if (existingFalvor) return existingFalvor;
		return this.flavorRepository.create({ name });
	}
}
