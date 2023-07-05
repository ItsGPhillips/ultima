import { render } from "@testing-library/react";

import { Avatar } from "./avatar";

describe("Avatar", () => {
   it("should render successfully", () => {
      const { baseElement } = render(<Avatar name="" />);
      expect(baseElement).toBeTruthy();
    });
});
