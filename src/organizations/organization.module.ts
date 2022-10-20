import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, UserService],
})
export class OrganizationModule {}
