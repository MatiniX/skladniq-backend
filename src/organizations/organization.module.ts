import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [UserModule],
})
export class OrganizationModule {}
