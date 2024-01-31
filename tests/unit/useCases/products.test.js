const { Product } = require("../../../src/entities");
const Chance = require("chance");
const chance = new Chance();
const { v4: uuidv4 } = require("uuid");
const {
  product: { addProductUseCase },
} = require("../../../src/useCases");
const {
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase,
} = require("../../../src/useCases/product");
const { cloneDeep } = require("lodash");
describe("Product use cases", () => {
  const testProduct = new Product({
    name: chance.name(),
    description: chance.sentence(),
    images: [uuidv4(), uuidv4()],
    price: chance.natural(),
    color: chance.color(),
    meta: {
      comment: "the best product for you dud ",
    },
  });
  const mockProductRepo = {
    add: jest.fn(async (product) => ({
      ...product,
      id: uuidv4(),
    })),
    getById: jest.fn(async (id) => ({
      id,
      name: chance.name(),
      description: chance.sentence(),
      images: [uuidv4(), uuidv4()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        comment: "mock  product data ",
      },
    })),

    update: jest.fn(async (product) => product),
    delete: jest.fn(async (product) => product),
  };

  const dependencies = {
    productRepository: mockProductRepo,
  };
  describe("Add product use case", () => {
    test("New product should be added", async () => {
      // call save product
      const addedProduct = await addProductUseCase(dependencies).execute(
        testProduct
      );

      // check the result
      expect(addedProduct).toBeDefined();
      expect(addedProduct.id).toBeDefined();
      expect(addedProduct.name).toBe(testProduct.name);
      expect(addedProduct.description).toBe(testProduct.description);
      expect(addedProduct.images).toEqual(testProduct.images);
      expect(addedProduct.price).toBe(testProduct.price);
      expect(addedProduct.color).toBe(testProduct.color);
      expect(addedProduct.meta).toEqual(testProduct.meta);

      // check the call
      const expectedUserData = mockProductRepo.add.mock.calls[0][0];
      expect(expectedUserData).toEqual(testProduct);
    });
  });

  describe("Get product by id", () => {
    test("Product should be found", async () => {
      // create fake id and get product in use case
      const randomId = uuidv4();
      const returnedProduct = await getProductByIdUseCase(dependencies).execute(
        { id: randomId }
      );

      // check that the data returned as expected
      expect(returnedProduct).toBeDefined();
      expect(returnedProduct.id).toBeDefined();
      expect(returnedProduct.name).toBeDefined();
      expect(returnedProduct.description).toBeDefined();
      expect(returnedProduct.images).toBeDefined();
      expect(returnedProduct.price).toBeDefined();
      expect(returnedProduct.color).toBeDefined();
      expect(returnedProduct.meta).toBeDefined();

      // check the mock call
      const expectedId = mockProductRepo.getById.mock.calls[0][0];
      expect(expectedId).toEqual(randomId);
    });
  });

  describe("Update product use case", () => {
    test("Product should be updated", async () => {
      const mockProduct = {
        ...testProduct,
        id: uuidv4(),
      };
      // call update
      const updatedProduct = await updateProductUseCase(dependencies).execute({
        product: mockProduct,
      });
      // check the returned data
      expect(updatedProduct).toEqual(mockProduct);
      // check the mock call
      const expectedProduct = mockProductRepo.update.mock.calls[0][0];
      expect(expectedProduct).toEqual(mockProduct);
    });
  });

  describe("Delete product use case", () => {
    test("Product should be deleted", async () => {
      // create a product with id

      const mockProduct = {
        ...testProduct,
        id: uuidv4(),
      };

      const deletedProduct = await deleteProductUseCase(dependencies).execute({
        product: cloneDeep(mockProduct),
      });

      // check the returned data
      expect(deletedProduct).toEqual(mockProduct);

      // check the mock call
      const expectedProduct = mockProductRepo.delete.mock.calls[0][0];
      expect(expectedProduct).toEqual(mockProduct);
    });
  });
});
