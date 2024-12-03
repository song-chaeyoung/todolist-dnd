import "styled-components";

declare module "styled-components" {
  interface DefaultTheme {
    bgColor: string;
    boardColor: string;
    cardColor: string;
    cardContainer: string;
    cardInput: string;
    textColor: string;
    toggleColor: string;
    toggleBgColor: string;
  }
}
