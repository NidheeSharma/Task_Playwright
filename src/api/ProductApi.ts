import type { ApiClient } from './ApiClient';
import type { ApiResult, BrandsBody, ProductsBody } from './types';

export class ProductApi {
  constructor(private readonly client: ApiClient) {}

  list(): Promise<ApiResult<ProductsBody>> {
    return this.client.get<ProductsBody>('productsList');
  }

  brands(): Promise<ApiResult<BrandsBody>> {
    return this.client.get<BrandsBody>('brandsList');
  }

  search(term: string): Promise<ApiResult<ProductsBody>> {
    return this.client.post<ProductsBody>('searchProduct', { search_product: term });
  }

  /** Sends arbitrary form data, for missing-parameter negative tests. */
  searchRaw(form: Record<string, string>): Promise<ApiResult> {
    return this.client.post('searchProduct', form);
  }

  /** Unsupported-method negative test (expects responseCode 405). */
  listWithPost(): Promise<ApiResult> {
    return this.client.post('productsList');
  }
}
