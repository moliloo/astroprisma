export const preloadHandlebarsTemplates = async function () {
   return loadTemplates([
    "systems/astroprisma/templates/actor/part/char-summary.hbs",
		"systems/astroprisma/templates/actor/part/char-hyperserum.hbs",
		"systems/astroprisma/templates/actor/part/char-favor.hbs",
		"systems/astroprisma/templates/actor/part/char-status.hbs",
		"systems/astroprisma/templates/actor/part/char-tabs.hbs",
   ]);
 };
 