import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function getArtChainSecrets() {
  try {
    const command = new GetSecretValueCommand({ SecretId: "ArtChainSecret" });
    const response = await client.send(command);

    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error("SecretString not found");
    }
  } catch (error) {
    console.error("Error fetching ArtChain secrets:", error);
    throw error;
  }
}
