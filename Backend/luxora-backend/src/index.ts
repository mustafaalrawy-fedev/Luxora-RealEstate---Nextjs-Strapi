import type { Core } from '@strapi/strapi';

// export default {
//   /**
//    * An asynchronous register function that runs before
//    * your application is initialized.
//    *
//    * This gives you an opportunity to extend code.
//    */
//   register(/* { strapi }: { strapi: Core.Strapi } */) {},

//   /**
//    * An asynchronous bootstrap function that runs before
//    * your application gets started.
//    *
//    * This gives you an opportunity to set up your data model,
//    * run jobs, or perform some special logic.
//    */
//   bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
// };

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // This tells Strapi to NEVER send these fields in any API response
    const userAttributes = strapi.contentType('plugin::users-permissions.user').attributes;

    userAttributes.password.private = true;
    userAttributes.resetPasswordToken.private = true;
    userAttributes.confirmationToken.private = true;
    
    // We make email private so Agents' emails aren't public to everyone
    // You can still access the email of the "logged in" user via /api/users/me
    userAttributes.email.private = true;
  },

  bootstrap(/*{ strapi }*/) {},
};
