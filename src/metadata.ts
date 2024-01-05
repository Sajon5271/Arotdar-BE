/* eslint-disable */
export default async () => {
    const t = {
        ["./schemas/user.schema"]: await import("./schemas/user.schema")
    };
    return { "@nestjs/swagger": { "models": [[import("./user/dtos/sign-in.dto"), { "SignInDto": { email: { required: true, type: () => String }, password: { required: true, type: () => String } } }], [import("./user/dtos/sign-up.dto"), { "SignUpDto": { email: { required: true, type: () => String }, name: { required: true, type: () => String, minLength: 2, maxLength: 50 }, password: { required: true, type: () => String, maxLength: 50 }, roles: { required: true, type: () => [String] } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHello": {} } }], [import("./user/auth.controller"), { "AuthController": { "signUp": { type: t["./schemas/user.schema"].User }, "signIn": {}, "signOut": { type: Object } } }], [import("./users/user.controller"), { "UserController": { "getAllUser": { type: [t["./schemas/user.schema"].User] } } }]] } };
};