import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'AIService',
      useClass: GeminiService,
    },
  ],
  exports: ['AIService'],
})
export class AIModule {}
