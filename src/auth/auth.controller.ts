import { Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(user: RegisterUserDto) {
        return this.authService.register(user) 
    }

    @Post("login")
    login(user: LoginUserDto) {
        return this.authService.login(user) 
    }

}
