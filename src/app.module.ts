import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { AccessControlService } from "./access-control/access-control.service";
import * as Joi from "joi";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

@Module({
	imports: [
		AuthModule,
		UsersModule,
		ConfigModule.forRoot({
			//ignoreEnvFile
			envFilePath: ".env",
			validationSchema: Joi.object({
				DATABASE_HOST: Joi.required().default("postgres"),
				DATABASE_PORT: Joi.number().default(5432),
				DATABASE_NAME: Joi.string().default("postgres"),
				DATABASE_USER: Joi.string().default("postgres"),
				DATABASE_PASSWORD: Joi.string().default("postgres")
			})
		}),
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
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.gql"),
			//typePaths: ["./**/*.graphql"],
			/* definitions: {
				path: join(process.cwd(), "src/graphql.ts")
			}, */
			playground: true //for develp only
		}),
		DatabaseModule
	],
	providers: [AccessControlService]
})
export class AppModule {}
