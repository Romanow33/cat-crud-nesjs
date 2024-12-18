import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthDecorator } from './decorators/auth.decorators';
import { Role } from '../common/enums/role.enum';
import { ActiveUser } from '../common/decorators/activeUser.decorator';
import { ActiveUserInterface } from '../common/interfaces/userActive.interfaces';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto
    ) {
        return this.authService.register(registerDto)
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto
    ) {
        return this.authService.login(loginDto)
    }

    @Get('profile')
    @AuthDecorator(Role.USER)
    profile(@ActiveUser() user: ActiveUserInterface) {
        return this.authService.profile(user)
    }
}
