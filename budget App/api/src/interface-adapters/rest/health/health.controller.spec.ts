import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('returns liveness status', () => {
    expect(controller.liveness()).toEqual({ status: 'ok' });
  });

  it('returns readiness status', () => {
    expect(controller.readiness()).toEqual({ status: 'ready' });
  });
});
