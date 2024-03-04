import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { AuthResolver } from "./auth.resolver";

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true, // with this you dont need to import the JwtModule anywhere in the app
			secret: jwtConstants.secret,
			signOptions: { expiresIn: "60s" }
		})
	],
	providers: [AuthService, AuthResolver],
	controllers: []
})
export class AuthModule {}
