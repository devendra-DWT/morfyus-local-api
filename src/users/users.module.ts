import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { UsersResolver } from './users.resolver';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Job])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
