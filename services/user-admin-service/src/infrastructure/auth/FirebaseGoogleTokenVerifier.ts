import { injectable } from "inversify";
import admin from "../config/firebase-admin"
import { IGoogleTokenVerifier } from "../../application/interface/auth/IGoogleTokenVerifier";
import { BadRequestError } from "art-chain-shared";
import { AUTH_MESSAGES } from "../../constants/authMessages";

@injectable()
export class FirebaseGoogleTokenVerifier
  implements IGoogleTokenVerifier
{
  async verify(token: string) {
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("decoded from firebase", decoded);

    if (!decoded) {
        throw new BadRequestError(AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN);
    }

    return {
      email: decoded.email!,
      name: decoded.name || "",
    };
  }
}
