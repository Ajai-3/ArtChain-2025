import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function getArtChainSecrets(secretId: string): Promise<Record<string, any>> {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await client.send(command);

    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error(`SecretString not found for ${secretId}`);
    }
  } catch (error) {
    console.error(`Error fetching secret ${secretId}:`, error);
    throw error;
  }
}
