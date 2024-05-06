import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmsModule } from './llms/llms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LlmsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
