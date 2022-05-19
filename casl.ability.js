const { AbilityBuilder, subject, Ability } = require("@casl/ability");
const { PrismaAbility } = require("@casl/prisma");

const { can, cannot, build } = new AbilityBuilder(PrismaAbility);

can("read", "User", { balance: 1.5 });

// cannot("read", "Post", { title: { startsWith: "[WIP]:" } });

const ability = build();

const a = new PrismaAbility([
  {
    action: "read",
    subject: "User",
    conditions: { balance: 1.5 },
    fields: ["username"],
    reason: "You are not allowed to access.",
  },
  {
    action: "update",
    subject: "User",
    fields: ["username"],
    conditions: { id: "0cb8ab33-c03c-4959-9519-1b5398aef9d9" },
    reason: "You are not allowed to update.",
  },
]);

// ability.can("read", "Post");
// ability.can("read", subject("Post", { title: "...", authorId: 1 }));

module.exports = a;
