export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		'systems/astroprisma/templates/actor/part/character/char/char-summary.hbs',
		'systems/astroprisma/templates/actor/part/character/char/char-hyperserum.hbs',
		'systems/astroprisma/templates/actor/part/character/char/char-favor.hbs',
		'systems/astroprisma/templates/actor/part/character/char/char-status.hbs',
		'systems/astroprisma/templates/actor/part/character/char/char-tabs.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-inventory.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-weapons.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-weapons-weapon.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-biography.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-effects.hbs',
		'systems/astroprisma/templates/actor/part/character/tab/tab-actions.hbs',
	])
}
