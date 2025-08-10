import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({ region: process.env.AWS_REGION || "ap-south-1" });

export async function getSecrets(names: string[]): Promise<Record<string, string>> {
  const cmd = new GetParametersCommand({
    Names: names,
    WithDecryption: true,
  });

  const res = await ssm.send(cmd);

  const secrets: Record<string, string> = {};
  res.Parameters?.forEach(param => {
    if (param.Name && param.Value) {
      secrets[param.Name] = param.Value;
    }
  });

  return secrets;
}
