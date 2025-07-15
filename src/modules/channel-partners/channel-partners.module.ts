import { Module } from '@nestjs/common';
import { ChannelPartnersController } from './channel-partners.controller';
import { ChannelPartnersService } from './channel-partners.service';

@Module({
  controllers: [ChannelPartnersController],
  providers: [ChannelPartnersService],
})
export class ChannelPartnersModule {} 