import lume from "lume/mod.ts";
import googleFonts from "lume/plugins/google_fonts.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";

const site = lume();

site.use(googleFonts({
  cssFile: "fonts.css",
  fonts: {
    display:
      "https://fonts.google.com/share?selection.family=Playfair+Display:ital,wght@0,400..900;1,400..900",
    text:
      "https://fonts.google.com/share?selection.family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900",
    code:
      "https://fonts.google.com/share?selection.family=JetBrains+Mono:ital,wght@0,100..800;1,100..800",
  },
}));

site.use(codeHighlight());
site.use(date())

site.add("style.css");
site.add("color.css");
site.add("code.css");

export default site;
