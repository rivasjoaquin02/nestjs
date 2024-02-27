import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Query
} from "@nestjs/common";
import { CoffeeService } from "./coffee.service";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import { UpdateCoffeeDto } from "./dto/update-coffee.dto";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Controller("coffee")
export class CoffeeController {
	constructor(
		private readonly coffeeService: CoffeeService,
		@Inject(REQUEST) private readonly request: Request
	) {
		console.log("CoffeeController is Instanciated");
	}

	@Get()
	async findAll(@Query() paginationQuery: PaginationQueryDto) {
		return await this.coffeeService.findAll(paginationQuery);
	}

	@Get(":id")
	async findOne(@Param("id") id: number) {
		console.log(typeof id);
		return await this.coffeeService.findOne("" + id);
	}

	@Post()
	async create(@Body() createCoffeeDto: CreateCoffeeDto) {
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
