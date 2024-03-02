import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { UsersController } from "./users.controller";
import { AccessControlService } from "src/access-control/access-control.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService, AccessControlService],
	exports: [UsersService],
	controllers: [UsersController]
})
export class UsersModule {}
