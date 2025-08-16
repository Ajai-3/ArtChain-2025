import http from "http";
import app from "./app";

const PORT = 3000;

const server = http.createServer(app);

// import { getArtChainSecrets } from "art-chain-shared";
// const s = await getArtChainSecrets()
// console.log(s)


server.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
