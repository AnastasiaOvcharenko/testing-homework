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

describe("Корзина:", function () {
  it("в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];
    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");

    await addToCartBtn.click();
    await addToCartBtn.click();

    const cartLink = await browser.$(
      '.navbar-nav .nav-link[href="/hw/store/cart"]'
    );

    const cartText = await cartLink.getText();
    expect(`Cart (1)`).toEqual(cartText);
  });

  it("В корзине должна отображаться таблица с добавленными в нее товарами", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];
    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();
    await browser.url(urlWithBug("/cart"));

    const productsTable = await browser.$(".Cart-Table");

    expect(productsTable).toBeDisplayed();
  });

  it("Для каждого товара должны отображаться название, цена, количество, стоимость, а также должна отображаться общая сумма заказа", async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];
    const { data: productById } = await api.getProductById(product.id);

    const cartData = {
      name: productById.name,
      price: `$${productById.price}`,
      count: "2",
      total: `$${productById.price * 2}`,
    };

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();
    await addToCartBtn.click();

    await browser.url(urlWithBug("/cart"));

    const cartItem = await browser.$(`[data-testid="${productById.id}"]`);
    const cartName = await cartItem.$(".Cart-Name");
    const cartPrice = await cartItem.$(".Cart-Price");
    const cartCount = await cartItem.$(".Cart-Count");
    const cartTotal = await browser.$(".Cart-OrderPrice");

    const cart = {
      name: await cartName.getText(),
      price: await cartPrice.getText(),
      count: await cartCount.getText(),
      total: await cartTotal.getText(),
    };

    expect(cart).toEqual(cartData);
  });

  it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async ({
    browser,
  }) => {
    const { data } = await api.getProducts();
    const product = data[0];
    const { data: productById } = await api.getProductById(product.id);

    await browser.url(urlWithBug(`/catalog/${productById.id}`));

    const addToCartBtn = await browser.$(".ProductDetails-AddToCart");
    await addToCartBtn.click();

    await browser.url(urlWithBug(`/cart`));

    const cartTable = await browser.$(".Cart-Table");
    expect(cartTable).not.toBePresent();
  });

  it("содержимое корзины должно сохраняться между перезагрузками страницы", async ({
    browser,
  }) => {
    await browser.url(urlWithBug(`/catalog/1`));

    const addProductBtn = await browser.$(".btn");

    await addProductBtn.waitForDisplayed();
    await addProductBtn.click();
    await browser.refresh();
    await browser.url(urlWithBug(`/cart`));

    const cartCount = await browser.$(".Cart-Table .Cart-Count");

    await cartCount.waitForDisplayed();

    expect(cartCount).toBeDisplayedInViewport();
  });
});
