import { Body, Controller, Get, Post } from '@nestjs/common';

interface CreateCategoryRequest {
  name: string;
}

@Controller('categories')
export class CategoriesController {
  @Get()
  listCategories() {
    return [];
  }

  @Post()
  createCategory(@Body() body: CreateCategoryRequest) {
    return {
      id: 'scaffolded-category-id',
      name: body.name,
      type: 'USER_DEFINED',
    };
  }
}
