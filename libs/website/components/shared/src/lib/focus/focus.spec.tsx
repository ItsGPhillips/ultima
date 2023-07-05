import { render } from '@testing-library/react';

import Focus from './focus';

describe('Focus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Focus />);
    expect(baseElement).toBeTruthy();
  });
});
