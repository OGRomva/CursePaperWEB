import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
async function bootstrap() {
    const PORT = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule, {cors: true});
    await app.listen(PORT);
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTION'],
        // allowed headers
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization'],
        // headers exposed to the client
        exposedHeaders: ['Authorization'],
        credentials: true
    })
    console.log('Server start on port: ' + PORT);
}

bootstrap();
