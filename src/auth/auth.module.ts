import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

//NOTE: gen secret with: openssl rand -base64 32
const SECRET = "wHad04rGT6sdA06/Ut4rR7kUXII+zBjoGra46PPF7Vs=";

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			secret: SECRET,
			signOptions: { expiresIn: "60s" }
		})
	],
	providers: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
