import { Inject, Injectable, Module } from "@nestjs/common";
import { CoffeeController } from "./coffee.controller";
import { CoffeeService } from "./coffee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coffee } from "./entity/coffee.entity";
import { Flavor } from "./entity/flavor.entity";
import { COFFEE_BRANDS } from "./coffee.constants";
import { Connection } from "typeorm";

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
	create() {
		return ["buddy brew", "nescafe"];
	}
}

@Module({
	imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
	controllers: [CoffeeController],
	//providers: [{ provide: CoffeeService, useValue: new CoffeeServiceMock() }],
	providers: [
		CoffeeService,
		//{ provide: COFFEE_BRANDS, useValue: ["buddy brew", "nescafe"] },

		// factory async provider
		{
			provide: COFFEE_BRANDS,
			useFactory: async (connection: Connection) => {
				const coffeeBrands = await Promise.resolve([
					"buddy brew",
					"nescafe"
				]);
				return coffeeBrands;
			},
			inject: [Connection]
		},
		// factory injectable function
		/* {
			provide: COFFEE_BRANDS,
			useFactory: (brandsFactory: CoffeeBrandsFactory) =>
				brandsFactory.create(),
			inject: [CoffeeBrandsFactory]
		}, */
		{
			provide: ConfigService,
			useClass:
				process.env.NODE_ENV === "development"
					? DevelopmentConfigService
					: ProductionConfigService
		}
	],
	exports: [CoffeeService]
})
export class CoffeeModule {}
