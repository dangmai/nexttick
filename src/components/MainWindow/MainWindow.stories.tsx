import React from "react";
import { action } from "@storybook/addon-actions";
import {MainWindow} from "./MainWindow";

export default {
  component: MainWindow,
  title: "MainWindow",
};

export const defaultWindow = () => (
  <MainWindow />
);
