import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
    load: [config],
  })],
})
export class AppModule {}
