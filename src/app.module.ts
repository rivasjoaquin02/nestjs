import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoffeeModule } from "./coffee/coffee.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CoffeeRatingModule } from "./coffee-rating/coffee-rating.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

import * as Joi from "joi";

@Module({
	imports: [
		ConfigModule.forRoot({
			//ignoreEnvFile
			envFilePath: ".env",
			validationSchema: Joi.object({
				DATABASE_HOST: Joi.required(),
				DATABASE_PORT: Joi.number().default(5432)
			})
		}),
		AuthModule,
		UsersModule,
		CoffeeModule,
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DATABASE_HOST,
			port: +process.env.DATABASE_PORT,
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME,
			autoLoadEntities: true,
			synchronize: true //for develp only
		}),
		CoffeeRatingModule,
		DatabaseModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
