import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private readonly userServices: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register({ name, email, password }: RegisterDto) {

        const user_existence = await this.userServices.findOneByEmail(email)
        if (user_existence) throw new BadRequestException('User already exist')

        return await this.userServices.create({
            name,
            password: await bcryptjs.hash(password, 10),
            email
        })
    }

    async login({ email, password }: LoginDto) {

        const user_existence = await this.userServices.findByEmailWithPassword(email)
        if (!user_existence) throw new UnauthorizedException('Email not found')

        const dehashed_password = await bcryptjs.compare(password, user_existence.password)

        if (!dehashed_password) throw new UnauthorizedException('Password is wrong')

        const payload = { email: user_existence.email, role: user_existence.role }
        const token = await this.jwtService.signAsync(payload)

        return { token, email }
    }

    async profile({ email, role }: { email: string, role: string }) {
        const user_existence = await this.userServices.findOneByEmail(email)
        return user_existence
    }

}
