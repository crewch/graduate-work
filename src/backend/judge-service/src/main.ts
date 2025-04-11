import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get<ConfigService>(ConfigService);

  const KAFKA_BROKER = configService.getOrThrow<string>('KAFKA_BROKER');

  await appContext.close();

  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'judge-service',
          brokers: [KAFKA_BROKER],
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: 'judge-service-group',
        },
        producer: {
          allowAutoTopicCreation: true,
          createPartitioner: Partitioners.DefaultPartitioner,
        },
      },
      logger: new ConsoleLogger({
        prefix: 'judge-service',
      }),
    });

  await microserviceApp.listen();
}
bootstrap();
