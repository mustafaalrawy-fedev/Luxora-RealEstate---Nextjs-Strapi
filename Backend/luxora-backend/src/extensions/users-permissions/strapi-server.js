import { Strapi } from "@strapi/strapi";

export default (plugin) => {
  const originalRegister = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    const { phone, user_type, terms } = ctx.request.body;

    // Run the original register logic first
    await originalRegister(ctx);

    // If registration succeeded, patch the new user with custom fields
    if (ctx.response.status === 200 && ctx.response.body?.user?.id) {
      const userId = ctx.response.body.user.id;

      await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        {
          data: {
            phone,
            user_type: user_type ?? "Buyer",
            terms: terms ?? false,
          },
        }
      );

      // Reflect updated fields in the response
      ctx.response.body.user.phone = phone;
      ctx.response.body.user.user_type = user_type;
      ctx.response.body.user.terms = terms;
    }
  };

  return plugin;
};