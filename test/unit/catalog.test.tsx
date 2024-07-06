import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import { createStore } from "redux";
import { Catalog } from "../../src/client/pages/Catalog";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Application } from "../../src/client/Application";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";

const path = "/";

describe("Каталог", () => {
  it("в каталоге должны отображаться товары, список которых приходит с сервера", () => {
    const initState = {
      cart: {},
      products: [
        { id: 1, name: "one", price: 100 },
        { id: 2, name: "two", price: 200 },
      ],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText("one")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "two" })).toBeInTheDocument();
  });

  it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
    const initState = {
      cart: {},
      products: [
        { id: 1, name: "one", price: 100 },
        { id: 2, name: "two", price: 200 },
      ],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByRole("heading", { name: "one" })).toBeInTheDocument();
    expect(screen.queryByText("$100")).toBeInTheDocument();

    expect(screen.queryByRole("heading", { name: "two" })).toBeInTheDocument();
    expect(screen.queryByText("$200")).toBeInTheDocument();

    expect(screen.queryAllByRole("link", { name: /Details/i })).toHaveLength(2);
  });

  it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', () => {
    const initState = {
      cart: {},
      products: [{ id: 1, name: "one", price: 100 }],
      details: {
        1: {
          id: 1,
          name: "one",
          price: 100,
          description: "Lorem ipsum",
          material: "Wood",
          color: "pink",
        },
      },
    };
    const store = createStore(() => initState);

    render(
      <MemoryRouter initialEntries={["/catalog/1"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.queryByRole("heading", { name: "one" })).toBeInTheDocument();
    expect(screen.queryByText("$100")).toBeInTheDocument();
    expect(screen.queryByText("Lorem ipsum")).toBeInTheDocument();
    expect(screen.queryByText("Wood")).toBeInTheDocument();
    expect(screen.queryByText("pink")).toBeInTheDocument();
    expect(screen.queryByText("Add to Cart")).toBeInTheDocument();
  });

  it("если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом", () => {
    const initState = {
      cart: { 1: {} },
      products: [
        { id: 1, name: "one", price: 100 },
        { id: 2, name: "two", price: 200 },
      ],
      details: {
        1: {
          id: 1,
          name: "one",
          price: 100,
          description: "Lorem ipsum",
          material: "Wood",
          color: "pink",
        },
      },
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    expect(screen.queryByText("Item in cart")).toBeInTheDocument();
  });

  it("если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом", () => {
    const initState = {
      cart: { 1: {} },
      products: [
        { id: 1, name: "one", price: 100 },
        { id: 2, name: "two", price: 200 },
      ],
      details: {
        1: {
          id: 1,
          name: "one",
          price: 100,
          description: "Lorem ipsum",
          material: "Wood",
          color: "pink",
        },
      },
    };

    const store = createStore(() => initState);

    render(
      <MemoryRouter initialEntries={["/catalog/1"]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("Item in cart")).toBeInTheDocument();
  });
});
