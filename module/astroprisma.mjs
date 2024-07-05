import { AstroprismaActor } from './documents/actor.mjs'
import { AstroprismaItem } from './documents/item.mjs'

import { AstroprismaActorSheet } from './sheets/actor-sheet.mjs'
import { AstroprismaItemSheet } from './sheets/item-sheet.mjs'

import { preloadHandlebarsTemplates } from './helpers/templates.mjs'
import { astroprisma } from './helpers/config.mjs'

import * as models from './data/_module.mjs'

Hooks.once('init', function () {
	console.log(astroprisma.ascii)
	console.log('Astroprisma | Initializing your journey through the space')

	game.astroprisma = {
		AstroprismaActor,
		AstroprismaItem,
		rollItemMacro,
	}

	CONFIG.ASTROPRISMA = astroprisma

	CONFIG.Actor.documentClass = AstroprismaActor
	CONFIG.Item.documentClass = AstroprismaItem
	CONFIG.Item.entityClass = AstroprismaItem

	CONFIG.Actor.dataModels = {
		character: models.AstroprismaCharacter,
		npc: models.AstroprismaNpc,
	}
	CONFIG.Item.dataModels = {
		weapon: models.AstroprismaWeapon,
		hack: models.AstroprismaHack,
		consumable: models.AstroprismaConsumable,
		starshipPart: models.AstroprismaStarshipPart,
		grenade: models.AstroprismaGrenade,
		narcobiotic: models.AstroprismaNarcobiotic,
		mod: models.AstroprismaMod,
		drone: models.AstroprismaDrone,
		armor: models.AstroprismaArmor,
		cybertech: models.AstroprismaCybertech,
		origin: models.AstroprismaOrigin
	}

	Items.unregisterSheet('core', ItemSheet)
	Items.registerSheet('astroprisma', AstroprismaItemSheet, { makeDefault: true })

	Actors.unregisterSheet('core', ActorSheet)
	Actors.registerSheet('astroprisma', AstroprismaActorSheet, { makeDefault: true })

	preloadHandlebarsTemplates()
})

Hooks.once('ready', function () {
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot))
})

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('ifEach', function(collection, condition, options) {
	if (condition && collection.length > 0) {
		return options.fn({ items: collection });
	 } else {
		return options.inverse(this);
	 }
 });

async function createItemMacro(data, slot) {
	// First, determine if this is a valid owned item.
	if (data.type !== 'Item') return
	if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
		return ui.notifications.warn('You can only create macro buttons for owned Items')
	}
	// If it is, retrieve it based on the uuid.
	const item = await Item.fromDropData(data)

	// Create the macro command using the uuid.
	const command = `game.astroprisma.rollItemMacro("${data.uuid}");`
	let macro = game.macros.find((m) => m.name === item.name && m.command === command)
	if (!macro) {
		macro = await Macro.create({
			name: item.name,
			type: 'script',
			img: item.img,
			command: command,
			flags: { 'astroprisma.itemMacro': true },
		})
	}
	game.user.assignHotbarMacro(macro, slot)
	return false
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
	// Reconstruct the drop data so that we can load the item.
	const dropData = {
		type: 'Item',
		uuid: itemUuid,
	}
	// Load the item from the uuid.
	Item.fromDropData(dropData).then((item) => {
		// Determine if the item loaded and if it's an owned item.
		if (!item || !item.parent) {
			const itemName = item?.name ?? itemUuid
			return ui.notifications.warn(`Could not find item ${itemName}. You may need to delete and recreate this macro.`)
		}

		// Trigger the item roll
		item.roll()
	})
}
