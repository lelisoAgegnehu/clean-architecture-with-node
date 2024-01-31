const Chance = require("chance");

const {
  productRepository,
} = require("../../../src/frameWorks/repositories/inMemory");
const { Product } = require("../../../src/entities");
const { cloneDeep } = require("lodash");

const chance = new Chance();
describe("Products repository", () => {
  test("New Product should be added and returned", async () => {
    // create a new product
    const testProduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });

    const addedProduct = await productRepository.add(testProduct);

    expect(addedProduct).toBeDefined();
    expect(addedProduct.id).toBeDefined();
    expect(addedProduct.name).toBe(testProduct.name);
    expect(addedProduct.description).toBe(testProduct.description);
    expect(addedProduct.images).toEqual(testProduct.images);
    expect(addedProduct.price).toBe(testProduct.price);
    expect(addedProduct.color).toBe(testProduct.color);
    expect(addedProduct.meta).toEqual(testProduct.meta);

    // get the product
    const returnedProduct = await productRepository.getById(addedProduct.id);
    expect(returnedProduct).toEqual(addedProduct);
  });
  test("New Product should be deleted", async () => {
    // add two new products
    const willBeDeletedProduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });

    const shouldStayProduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "UK",
        },
      },
    });

    const [willBeDeletedAddedProduct, shouldStayAddedProduct] =
      await Promise.all([
        productRepository.add(willBeDeletedProduct),
        productRepository.add(shouldStayProduct),
      ]);
    expect(willBeDeletedAddedProduct).toBeDefined();
    expect(shouldStayAddedProduct).toBeDefined();

    // delete one product
    const deletedProduct = await productRepository.delete(
      willBeDeletedAddedProduct
    );
    expect(deletedProduct).toEqual(willBeDeletedAddedProduct);

    // try to get the deleted product( it should not exist )
    const shouldBeUndefinedProduct = await productRepository.getById(
      deletedProduct.id
    );
    expect(shouldBeUndefinedProduct).toBeUndefined();

    // check that the second product is still there
    const shouldBeDefinedProduct = await productRepository.getById(
      shouldStayAddedProduct.id
    );
    expect(shouldBeDefinedProduct).toBeDefined();
  });
  test("New Product should be updated", async () => {
    // add a new product
    const testProduct = new Product({
      name: chance.name(),
      description: chance.sentence(),
      images: [chance.url(), chance.url()],
      price: chance.natural(),
      color: chance.color(),
      meta: {
        deliver: {
          from: "China",
        },
      },
    });

    const addedProduct = await productRepository.add(testProduct);
    expect(addedProduct).toBeDefined();

    // clone the product and update
    const cloneProduct = cloneDeep({
      ...addedProduct,
      name: chance.name(),
      price: chance.natural(),
    });

    // check that the product is updated
    const updatedProduct = await productRepository.update(cloneProduct);
    expect(updatedProduct).toEqual(cloneProduct);
  });
});
