export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		'systems/astroprisma/templates/actor/part/character/char-summary.hbs',
		'systems/astroprisma/templates/actor/part/character/char-hyperserum.hbs',
		'systems/astroprisma/templates/actor/part/character/char-favor.hbs',
		'systems/astroprisma/templates/actor/part/character/char-status.hbs',
		'systems/astroprisma/templates/actor/part/character/char-tabs.hbs',
		'systems/astroprisma/templates/actor/part/character/tab-inventory.hbs',
		'systems/astroprisma/templates/actor/part/character/tab-weapons.hbs',
		'systems/astroprisma/templates/actor/part/character/tab-biography.hbs',
		'systems/astroprisma/templates/actor/part/character/tab-effects.hbs',
		'systems/astroprisma/templates/actor/part/character/tab-actions.hbs'
	])
}
