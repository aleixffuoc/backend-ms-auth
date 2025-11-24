import app from "./app";
import dotenvFlow from "dotenv-flow";

const main = () => {
  dotenvFlow.config();
  app.listen(app.get("port"));
};

main();
