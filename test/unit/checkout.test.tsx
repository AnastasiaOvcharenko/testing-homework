import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Form } from "../../src/client/components/Form";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/jest-globals";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

const path = "/";

describe("checkout form", () => {
  it("Невалидный телефон не вводится", async () => {
    const onSubmit = jest.fn();
    const initState = {
      cart: {},
      products: [{ id: 1, name: "one", price: 100 }],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Form onSubmit={onSubmit} />
        </Provider>
      </BrowserRouter>
    );

    const phoneInput = await screen.findByLabelText("Phone");
    await fireEvent.change(phoneInput, { target: { value: "123" } });
    await fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

    expect(phoneInput).toHaveClass("is-invalid");
  });

  it("Валидный телефон вводится", async () => {
    const onSubmit = jest.fn();
    const initState = {
      cart: {},
      products: [{ id: 1, name: "one", price: 100 }],
    };
    const store = createStore(() => initState);

    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Form onSubmit={onSubmit} />
        </Provider>
      </BrowserRouter>
    );

    const phoneInput = await screen.findByLabelText("Phone");
    await fireEvent.change(phoneInput, { target: { value: "88005553535" } });
    await fireEvent.click(screen.getByRole("button", { name: "Checkout" }));

    expect(phoneInput).not.toHaveClass("is-invalid");
  });

  it("Форма отправляется на сервер при валидных полях", async () => {
    const onSubmit = jest.fn();
    const initState = {
      cart: {},
      products: [{ id: 1, name: "one", price: 100 }],
    };
    const store = createStore(() => initState);
    render(
      <BrowserRouter basename={path}>
        <Provider store={store}>
          <Form onSubmit={onSubmit} />
        </Provider>
      </BrowserRouter>
    );

    const nameInput = await screen.findByLabelText("Name");
    await fireEvent.change(nameInput, { target: { value: "name" } });

    const phoneInput = await screen.findByLabelText("Phone");
    await fireEvent.change(phoneInput, { target: { value: "88005553535" } });

    const addressInput = await screen.findByLabelText("Address");
    await fireEvent.change(addressInput, { target: { value: "address" } });

    await fireEvent.click(screen.getByRole("button", { name: "Checkout" }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
