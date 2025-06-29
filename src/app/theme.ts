import { createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "blue",
  primaryShade: 9,
  defaultRadius: "xs",
  fontSmoothing: true,
  fontFamily: "Akrobat, sans-serif",
  radius:{
    xxs: '0.2vh',
    xs: '0.4vh',
    sm: '0.75vh',
    md: '1vh',
    lg: '1.5vh',
    xl: '2vh',
    xxl: '3vh',
  },

  fontSizes: {
    xxs: '1.2vh',
    xs: '1.5vh',
    sm: '1.8vh',
    md: '2.2vh',
    lg: '2.8vh',
    xl: '3.3vh',
    xxl: '3.8vh',
  },

  spacing:{
    xxs: '0.5vh',
    xs: '0.75vh',
    sm: '1.5vh',
    md: '2vh',
    lg: '3vh',
    xl: '4vh',
    xxl: '5vh',
  },

  colors: {
    dark:[
      "#ffffff",
      "#e2e2e2",
      "#c6c6c6",
      "#aaaaaa",
      "#8d8d8d",
      "#717171",
      "#555555",
      "#393939",
      "#1c1c1c",
      "#000000",
    ],
  },
});


export default theme;