import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true, // with this you dont need to import the JwtModule anywhere in the app
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "60s" }
		})
	],
	providers: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
