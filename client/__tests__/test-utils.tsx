/* eslint-disable import/export */
import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';
import { StoreContext } from '../context/stateStore';
import { ReactElement } from 'react';

afterEach(() => {
  cleanup();
});

type providerProps = any | undefined;
type renderOptions = {} | undefined;
interface customRenderProps {
  ui: ReactElement;
  providerProps?: providerProps;
  renderOptions?: renderOptions;
}

const customRender = (ui: ReactElement, providerProps?: providerProps, renderOptions?: renderOptions) => {
  return render(
    // wrap provider(s) here if needed
    <StoreContext.Provider value={providerProps}>{ui}</StoreContext.Provider>,

    renderOptions,
  );
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
