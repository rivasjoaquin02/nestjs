import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoffeeModule } from "./coffee/coffee.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [
		AuthModule,
		UsersModule,
		CoffeeModule,
		TypeOrmModule.forRoot({
			type: "postgres",
			//host: "172.23.0.1",
			host: "localhost",
			port: 5432,
			username: "postgres",
			password: "1234",
			database: "postgres",
			autoLoadEntities: true,
			synchronize: true //for develp only
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
