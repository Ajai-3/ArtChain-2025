  import http from "http";
  import app from "./app";
  import { getArtChainSecrets } from "art-chain-shared";

  const PORT = 3000;

  const server = http.createServer(app);


  const secret = await getArtChainSecrets()

  console.log(secret)

  server.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });