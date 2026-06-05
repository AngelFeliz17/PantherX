import { Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  exports: [DomainService],
  imports: [PrismaModule],
  providers: [DomainService],
  controllers: [DomainController]
})
export class DomainModule {}