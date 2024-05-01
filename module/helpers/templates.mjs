export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		'systems/astroprisma/templates/actor/part/char-summary.hbs',
		'systems/astroprisma/templates/actor/part/char-hyperserum.hbs',
		'systems/astroprisma/templates/actor/part/char-favor.hbs',
		'systems/astroprisma/templates/actor/part/char-status.hbs',
		'systems/astroprisma/templates/actor/part/char-tabs.hbs',
		'systems/astroprisma/templates/actor/part/tab-cybertech.hbs',
		'systems/astroprisma/templates/actor/part/tab-inventory.hbs',
		'systems/astroprisma/templates/actor/part/tab-weapons.hbs',
		'systems/astroprisma/templates/actor/part/char-effects.hbs',
	])
}
