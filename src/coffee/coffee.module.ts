import { Module } from "@nestjs/common";
import { CoffeeController } from "./coffee.controller";
import { CoffeeService } from "./coffee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coffee } from "./entity/coffee.entity";
import { Flavor } from "./entity/flavor.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
	controllers: [CoffeeController],
	providers: [CoffeeService]
})
export class CoffeeModule {}
