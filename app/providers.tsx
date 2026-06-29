"use client";

import { PropsWithChildren } from "react";
import { store } from "../redux/store";
import { Provider } from "react-redux";

export default function ReduxProvider({ children }: PropsWithChildren) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}
