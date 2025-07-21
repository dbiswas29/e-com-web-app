import { Injectable } from '@nestjs/common';
import { Product } from '../types/product.interface';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOne(id: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === id);
  }

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async remove(id: string): Promise<void> {
    this.products = this.products.filter(product => product.id !== id);
  }
}