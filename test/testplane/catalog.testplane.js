import { ExampleApi } from "../../src/client/api";

const base = "http://localhost:3000/hw/store";
const api = new ExampleApi(base);

export const urlWithBug = (path = "") => {
  const BUG_ID = process.env.BUG_ID || "";
  return `${base}${path}${BUG_ID ? `?bug_id=${BUG_ID}` : ""}`;
};

afterEach(async ({ browser }) => {
  await browser.execute(() => {
    localStorage.clear();
  });
});

describe("Каталог:", function () {
  it("в каталоге должны отображаться товары, список которых приходит с сервера", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    await browser.url(urlWithBug("/catalog"));

    const products = await Promise.all(
      await browser.$$(".ProductItem").map((item) => item)
    );

    const items = await Promise.all(
      products.map(async (item) => {
        const id = await item.getAttribute("data-testid");
        const name = await item.$(".ProductItem-Name");
        const price = await item.$(".ProductItem-Price");

        return {
          id: parseInt(id),
          name: await name.getText(),
          price: parseInt((await price.getText()).replace(/[^0-9.]/g, "")),
        };
      })
    );

    expect(items).toEqual(data);
  });

  it("для каждого товара в каталоге отображается название", async ({
    browser,
  }) => {
    await browser.url(urlWithBug("/catalog"));

    const productNames = await Promise.all(
      await browser
        .$$(".ProductItem")
        .map((item) => item.$(".ProductItem-Name").getText())
    );

    productNames.forEach((name) => {
      expect(name).toBeTruthy();
    });
  });

  it("на странице с подробной информацией отображается: название товара, описание, цена, цвет, материал", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];

    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const productName = await browser.$(".ProductDetails-Name").getText();
    const productDescription = await browser
      .$(".ProductDetails-Description")
      .getText();
    const productColor = await browser.$(".ProductDetails-Color").getText();
    const productMaterial = await browser
      .$(".ProductDetails-Material")
      .getText();
    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");

    expect(productName.toLowerCase()).toEqual(productById.name.toLowerCase());
    expect(productDescription.toLowerCase()).toEqual(
      productById.description.toLowerCase()
    );
    expect(productColor.toLowerCase()).toEqual(productById.color.toLowerCase());
    expect(productMaterial.toLowerCase()).toEqual(
      productById.material.toLowerCase()
    );
    expect(addToCartBtn).toBeDisplayed();
  });

  it("если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];
    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    addToCartBtn.click();

    const addedToCartMessage = await browser.$(".CartBadge");

    expect(addedToCartMessage).toBeDisplayed();
  });

  it("если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];

    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    addToCartBtn.click();

    await browser.url(urlWithBug("/catalog"));

    const addedToCartMessage = await browser.$(".CartBadge");

    expect(addedToCartMessage).toBeDisplayed();
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];

    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();

    await browser.url(urlWithBug("/cart"));

    const itemsCount = (
      await browser.$(`[data-testid="${productById.id}"]`)
    ).$$(".Cart-Name");

    await browser.refresh();

    const itemsCountNew = (
      await browser.$(`[data-testid="${productById.id}"]`)
    ).$$(".Cart-Name");

    expect(itemsCount.length).toEqual(itemsCountNew.length);
  });
});
