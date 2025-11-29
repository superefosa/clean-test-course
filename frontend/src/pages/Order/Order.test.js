import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { API_URL } from "../../utils/constants";
import axios from "axios";
import Order from ".";
import OrderContext from "../../context/OrderContext";

describe("Test Order", () => {
  let orderName;
  let orderItems;

  beforeEach(() => {
    orderName = "test-fun";
    orderItems = [
      { item: "Test 1", quantity: 1 },
      { item: "Test 2", quantity: 2 },
      { item: "Test 3", quantity: 3 },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Test Delivery Fee shows up correctly", async () => {
    setupMock();

    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    await waitFor(() => {
      // Since distance defaults to 0 miles, delivery fee should be 2.5 => "$2.50"
      expect(screen.getByText("$2.50")).toBeInTheDocument();
    });
  });

  test("Test Update Delivery Fee when distance changes", async () => {
    setupMock();

    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    // Update distance to 5 miles
    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      screen.getByRole("option", { name: "5 miles" })
    );

    await waitFor(() => {
      // After selecting 5 miles the mock returns 5.0 => "$5.00"
      expect(screen.getByText("$5.00")).toBeInTheDocument();
    });
  });
});

const setupMock = () => {
  const mockGet = jest.spyOn(axios, "get");
  mockGet.mockImplementation((url) => {
    switch (url) {
      case `${API_URL}/api/delivery/test-fun/0`:
        return Promise.resolve({
          data: { status: "success", data: 2.5 },
        });
      case `${API_URL}/api/delivery/test-fun/5`:
        return Promise.resolve({
          data: { status: "success", data: 5.0 },
        });
      default:
        return Promise.resolve({
          data: { status: "fail" },
        });
    }
  });
};
