import OAuth2Strategy, {
  StrategyOptions,
  StrategyOptionsWithRequest,
  VerifyFunction,
  VerifyFunctionWithRequest,
} from "passport-oauth2";
import type { Profile } from "passport";

export class Strategy extends OAuth2Strategy {
  /**
   * Creates an instance of ClickUpStrategy.
   * @constructor
   *
   * @param {VerifyFunction} verify - Callback function to validate credentials and handle user authentication
   */
  constructor(verify: VerifyFunction);
  /**
   * Creates an instance of ClickUpStrategy.
   * @constructor
   *
   * @param {Omit<StrategyOptions, "authorizationURL" | "tokenURL">} options - Configuration options for the strategy
   * @param {VerifyFunction} verify - Callback function to validate credentials and handle user authentication
   */
  constructor(
    options: Omit<StrategyOptions, "authorizationURL" | "tokenURL">,
    verify: VerifyFunction,
  );
  /**
   * Creates an instance of ClickUpStrategy.
   * @constructor
   *
   * @param {Omit<StrategyOptionsWithRequest, "authorizationURL" | "tokenURL">} options - Configuration options including request passing
   * @param {VerifyFunctionWithRequest} verify - Callback function with request object to validate credentials
   */
  constructor(
    options: Omit<StrategyOptionsWithRequest, "authorizationURL" | "tokenURL">,
    verify: VerifyFunctionWithRequest,
  );
  constructor(
    optionsOrVerify:
      | Omit<StrategyOptions, "authorizationURL" | "tokenURL">
      | Omit<StrategyOptionsWithRequest, "authorizationURL" | "tokenURL">
      | VerifyFunction,
    verifyFunction?: VerifyFunction | VerifyFunctionWithRequest,
  ) {
    if (arguments.length == 0)
      throw new Error("You should at least provide the verify function.");

    if (typeof optionsOrVerify === "function") {
      super(
        {
          authorizationURL: "https://app.clickup.com/api",
          tokenURL: "https://api.clickup.com/api/v2/oauth/token",
          clientID: process.env.CLICKUP_CLIENT_ID,
          clientSecret: process.env.CLICKUP_CLIENT_SECRET,
          callbackURL: process.env.CLICKUP_REDIRECT_URL,
        },
        optionsOrVerify,
      );
    } else if (
      typeof optionsOrVerify === "object" &&
      optionsOrVerify.passReqToCallback === true
    ) {
      super(
        optionsOrVerify as StrategyOptionsWithRequest,
        verifyFunction as VerifyFunctionWithRequest,
      );
    } else {
      super(
        optionsOrVerify as StrategyOptions,
        verifyFunction as VerifyFunction,
      );
    }
  }

  async userProfile(
    accessToken: string,
    done: (err?: Error, profile?: Profile) => void,
  ) {
    const response = await fetch("https://api.clickup.com/api/v2/user", {
      headers: { Authorization: accessToken, Accept: "application/json" },
    });

    if (response.status !== 200) {
      done(new Error("Unable to retrieve user profile"), null);
    } else {
      const body = await response.json();
      return done(null, {
        displayName: body.user.username,
        provider: "clickup",
        name: body.user.username,
        id: body.user.id,
        username: body.user.email,
        emails: [{ value: body.user.email, type: "verified" }],
        photos: [{ value: body.user.profilePicture }],
      });
    }
  }
}
