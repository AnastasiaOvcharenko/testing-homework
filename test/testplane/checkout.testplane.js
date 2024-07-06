const base = "http://localhost:3000/hw/store";

export const urlWithBug = (path = "") => {
  const BUG_ID = process.env.BUG_ID || "";
  return `${base}${path}${BUG_ID ? `?bug_id=${BUG_ID}` : ""}`;
};

describe("Форма заказа", () => {
  it("При отправке формы заказа отображается сообщение об успешности", async ({
    browser,
  }) => {
    await browser.url(urlWithBug("/catalog/1"));

    const addCartButton = await browser.$(".btn");

    await addCartButton.waitForDisplayed();
    await addCartButton.click();
    await browser.url(urlWithBug("/cart"));

    const inputName = await browser.$("#f-name");
    const inputPhone = await browser.$("#f-phone");
    const inputEmail = await browser.$("#f-address");

    await inputName.setValue("aaa");
    await inputPhone.setValue("88005553535");
    await inputEmail.setValue("aaa");

    const submitButton = await browser.$(".Form-Submit");
    await submitButton.click();

    const successMessage = await browser.$(
      ".Cart-SuccessMessage.alert-success"
    );

    await successMessage.waitForDisplayed();

    expect(successMessage).toBeDisplayed();
  });
});
