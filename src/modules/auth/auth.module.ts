import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [JwtModule.register({}), UserModule, ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {
}
