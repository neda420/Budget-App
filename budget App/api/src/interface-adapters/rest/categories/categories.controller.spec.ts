import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('returns empty categories list', () => {
    expect(controller.listCategories()).toEqual([]);
  });

  it('returns scaffolded created category', () => {
    expect(controller.createCategory({ name: 'Food' })).toEqual({
      id: 'scaffolded-category-id',
      name: 'Food',
      type: 'USER_DEFINED',
    });
  });
});
