import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from '../constants/jwt.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {


    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization

    if (!authorization) {
      return false
    }

    const token = await this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      )

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException()
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}