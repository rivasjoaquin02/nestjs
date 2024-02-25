import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from "@nestjs/common";
import { CoffeeService } from "./coffee.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";

@Controller("coffee")
export class CoffeeController {
	constructor(private readonly coffeeService: CoffeeService) {}

	@Get()
	async findAll() {
		return "hola";
		return await this.coffeeService.findAll();
	}

	@Get(":id")
	async findOne(@Param("id") id: number) {
		console.log(typeof id);
		return await this.coffeeService.findOne("" + id);
	}

	@Post()
	async create(@Body() createCoffeeDto: CreateCoffeeDto) {
		console.log(createCoffeeDto instanceof CreateCoffeeDto);
		return await this.coffeeService.create(createCoffeeDto);
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() updateCoffeeDto: UpdateCoffeeDto
	) {
		await this.coffeeService.update(id, updateCoffeeDto);
	}

	@Delete(":id")
	async delete(@Param("id") id: string) {
		await this.coffeeService.remove(id);
	}
}
