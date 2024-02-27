import { Module } from "@nestjs/common";
import { CoffeeRatingService } from "./coffee-rating.service";
import { CoffeeModule } from "src/coffee/coffee.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
	imports: [
		CoffeeModule
		/* DatabaseModule.register({
			type: "postgres",
			host: "localhost",
			password: "1234",
			port: 5432
		}) */
	],
	providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
