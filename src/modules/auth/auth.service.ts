import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserCreationDto } from '../user/dto/userCreationDto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {
    }

    async signUp(dto: UserCreationDto) {
        const userExist = await this.userService.findByUsername(dto.username);
        if (userExist) {
            throw new BadRequestException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'User with this name is already exist',
            });
        }

        const hash = await this.hashData(dto.password);

        const newUser = await this.userService.createUser({
            ...dto,
            password: hash,
        });

        const tokens = await this.getTokens(newUser.dataValues.user_id, newUser.dataValues.username);
        await this.updateRefreshToken(newUser.dataValues.user_id, tokens.refreshToken);
        const user = {
            user_id: userExist.dataValues.user_id,
            username: userExist.dataValues.username
        }
        return { ...tokens, user};
    }

    async singIn(dto: AuthDto) {
        const userExist = await this.userService.findByUsername(dto.username);

        if (!userExist) {
            throw new BadRequestException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'user with this username doesn\'t exist',
            });
        }

        const pasMatch = await argon2.verify(userExist.dataValues.password, dto.password);

        if (!pasMatch) {
            throw new BadRequestException({
                statusCode: HttpStatus.FORBIDDEN,
                message: 'password is incorrect ',
            });
        }

        const tokens = await this.getTokens(userExist.dataValues.user_id, userExist.dataValues.username);
        await this.updateRefreshToken(userExist.dataValues.user_id, tokens.refreshToken);
        const user = {
            user_id: userExist.dataValues.user_id,
            username: userExist.dataValues.username
        }
        return { ...tokens, user};
    }

    async logout(user_id: number) {
        return this.userService.update(user_id, { refresh_token: null });
    }

    async hashData(data: string) {
        return await argon2.hash(data);
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);

        await this.userService.update(id, { refresh_token: hashedRefreshToken });
    }

    async getTokens(id: number, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '10m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '1h',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(id: number, refreshToken: string) {
        const user = await this.userService.findById(id);

        if (!user || !user.dataValues.refresh_token) throw new ForbiddenException('Access denied');

        const refreshTokenMatches = await argon2.verify(user.dataValues.refresh_token, refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access denied');

        const tokens = await this.getTokens(user.dataValues.user_id, user.dataValues.username);
        await this.updateRefreshToken(user.dataValues.user_id, tokens.refreshToken);

        const newUser = {
            user_id: user.dataValues.user_id,
            username: user.dataValues.username
        }

        return { ...tokens, user};
    }
}
