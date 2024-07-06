const base = "http://localhost:3000/hw/store";

export const urlWithBug = (path = "") => {
  const BUG_ID = process.env.BUG_ID || "";
  return `${base}${path}${BUG_ID ? `?bug_id=${BUG_ID}` : ""}`;
};

describe("Страницы:", () => {
  it("в магазине должна быть главная", async ({ browser }) => {
    await browser.url(urlWithBug());

    const mainText = await browser.$("p=Welcome to Kogtetochka store!");
    const isDisplayed = await mainText.isDisplayed();

    expect(isDisplayed).toBeTruthy();
  });

  it("в магазине должен быть каталог", async ({ browser }) => {
    await browser.url(urlWithBug(`/catalog`));

    const mainText = await browser.$("h1=Catalog");
    const isDisplayed = await mainText.isDisplayed();

    expect(isDisplayed).toBeTruthy();
  });

  it("в магазине должна быть страница доставка", async ({ browser }) => {
    await browser.url(urlWithBug(`/delivery`));

    const mainText = await browser.$("h1=Delivery");
    const isDisplayed = await mainText.isDisplayed();

    expect(isDisplayed).toBeTruthy();
  });

  it("в магазине должны быть контакты", async ({ browser }) => {
    await browser.url(urlWithBug(`/contacts`));

    const mainText = await browser.$("h1=Contacts");
    const isDisplayed = await mainText.isDisplayed();

    expect(isDisplayed).toBeTruthy();
  });

  it("в магазине должна быть корзина", async ({ browser }) => {
    await browser.url(urlWithBug(`/cart`));

    const mainText = await browser.$("h1=Shopping cart");
    const isDisplayed = await mainText.isDisplayed();

    expect(isDisplayed).toBeTruthy();
  });
});
