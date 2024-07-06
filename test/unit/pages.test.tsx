import { it, describe, expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Home } from "../../src/client/pages/Home";
import { Catalog } from "../../src/client/pages/Catalog";
import { Delivery } from "../../src/client/pages/Delivery";
import { Contacts } from "../../src/client/pages/Contacts";
import { Application } from "../../src/client/Application";
import { Cart } from "../../src/client/pages/Cart";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { initStore } from "../../src/client/store";
import { CartApi, ExampleApi } from "../../src/client/api";

const initState = { cart: {} };
const store = createStore(() => initState);

describe("Страницы и навигация", () => {
  it("Должна быть главная страница", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Home />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByText("Welcome to Kogtetochka store!")
    ).toBeInTheDocument();
  });

  it("Страница каталога имеет статическое содержимое", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "Catalog" })
    ).toBeInTheDocument();
  });

  it("Страница условий доставки имеет статическое содержимое", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Delivery />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "Delivery" })
    ).toBeInTheDocument();
  });

  it("Страница контактов имеет статическое содержимое", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Contacts />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "Contacts" })
    ).toBeInTheDocument();
  });

  it("Страница корзины имеет статическое содержимое", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByRole("heading", { name: "Shopping cart" })
    ).toBeInTheDocument();
  });

  it("Должна быть шапка с ссылками на страницы", () => {
    render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const catalog = screen.queryByRole("link", { name: /catalog/i });
    const delivery = screen.queryByRole("link", { name: /delivery/i });
    const contacts = screen.queryByRole("link", { name: /contacts/i });
    const cart = screen.queryByRole("link", { name: /cart/i });

    expect(catalog).toBeInTheDocument();
    expect(catalog).toHaveAttribute("href", "/catalog");

    expect(delivery).toBeInTheDocument();
    expect(delivery).toHaveAttribute("href", "/delivery");

    expect(contacts).toBeInTheDocument();
    expect(contacts).toHaveAttribute("href", "/contacts");

    expect(cart).toBeInTheDocument();
    expect(cart).toHaveAttribute("href", "/cart");
  });

  it('при выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
    const store = initStore(
      new ExampleApi("/hw/store/catalog/"),
      new CartApi()
    );
    const { container } = render(
      <BrowserRouter basename={"/"}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const link = container.querySelector(".nav-link");
    const button_toggle = container.querySelector(".navbar-toggler");

    await fireEvent.click(button_toggle!);
    await fireEvent.click(link!);

    const menu = container.querySelector(".navbar-collapse");

    expect(menu?.classList.contains("collapse")).toBe(true);
  });
});
