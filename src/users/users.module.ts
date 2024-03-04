import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersResolver } from "./users.resolver";
import { AccessControlService } from "src/access-control/access-control.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersResolver, UsersService, AccessControlService],
	exports: [UsersService],
	controllers: []
})
export class UsersModule {}
