import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/user/user.model';
import { Repositories } from './modules/repositories/repositories.model';
import { Branch } from './modules/branch/branch.model';
import { Commit } from './modules/commit/commit.model';
import { FileRep } from './modules/file-rep/file-rep.model';
import { CommitModule } from './modules/commit/commit.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        AuthModule,
        UserModule,
        RepositoriesModule,
        CommitModule,
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            autoLoadModels: true,
            models: [User, Repositories, Branch, Commit, FileRep],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
