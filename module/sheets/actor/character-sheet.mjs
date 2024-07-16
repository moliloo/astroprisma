import { astroprisma } from '../../helpers/config.mjs'

export class AstroprismaCharacterSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['astroprisma', 'sheet', 'actor', 'character'],
			width: 630,
			height: 670,
			tabs: [{ navSelector: '.tab-nav', contentSelector: '.tab-select', initial: 'description' }],
		})
	}

	get template() {
		return `systems/astroprisma/templates/actor/actor-character-sheet.hbs`
	}

	getData() {
		const context = super.getData()
		const actorData = context.data

		context.system = actorData.system
		context.config = CONFIG.ASTROPRISMA
		context.rollData = context.actor.getRollData()

		this._prepareItems(context)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.hyper-minus').on('click', this._removeHyperdriveValue.bind(this))
		html.find('.hyper-plus').on('click', this._addHyperdriveValue.bind(this))

		if (!this.isEditable) return

		html.on('click', '.item-toggle-equip', this._equipItem.bind(this))
		html.on('click', '.item-toggle-unequip', this._unequipItem.bind(this))

		html.on('click', '.item-folder-open', this._openFolder.bind(this))
		html.on('click', '.item-folder-close', this._closeFolder.bind(this))

		html.find('.item-edit').on('click', this._onItemEdit.bind(this))
		html.on('click', '.rollable', this._onRoll.bind(this))

		html.find('.consumable-plus').on('click', this._addConsumable.bind(this))

		html.find('.item-create').on('click', this._onItemCreate.bind(this))
		html.on('click', '.item-delete', (ev) => {
			const li = $(ev.currentTarget).parents('.item')
			const item = this.actor.items.get(li.data('itemId'))
			item.delete()
			li.slideUp(200, () => this.render(false))
		})

		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev)
			html.find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return
				li.setAttribute('draggable', true)
				li.addEventListener('dragstart', handler, false)
			})
		}

		new ContextMenu(html, '.weapon-item', this.itemContextMenu)
		new ContextMenu(html, '.hack-item', this.itemContextMenu)
		new ContextMenu(html, '.cybertech-item', this.itemContextMenu)
		new ContextMenu(html, '.item-item', this.itemContextMenu)
	}

	itemContextMenu = [
		{
			name: game.i18n.localize('ASTRO.actor.itemOption.editItem'),
			icon: '<i class="fa-solid fa-pen-to-square"></i>',
			callback: (event) => {
				const item = this.actor.items.get(event[0].attributes[1].nodeValue)
				item.sheet.render(true)
			},
		},
		{
			name: game.i18n.localize('ASTRO.actor.itemOption.deleteItem'),
			icon: '<i class="fas fa-trash"></i>',
			callback: (event) => {
				const item = this.actor.items.get(event[0].attributes[1].nodeValue)
				item.delete()
			},
		},
	]

	async _prepareItems(event) {
		// Initialize containers.
		const weapons = []
		const hacks = []
		const cybertechs = []
		const armors = []
		const consumables = []
		const drones = []
		const grenades = []
		const mods = []

		// Iterate through items, allocating to containers
		for (let i of event.items) {
			i.img = i.img || Item.DEFAULT_ICON

			switch (i.type) {
				case 'weapon':
					weapons.push(i)
					break
				case 'hack':
					hacks.push(i)
					break
				case 'cybertech':
					cybertechs.push(i)
					break
				case 'armor':
					armors.push(i)
					break
				case 'consumable':
					consumables.push(i)
					break
				case 'drone':
					drones.push(i)
					break
				case 'grenade':
					grenades.push(i)
					break
				case 'mod':
					mods.push(i)
					break
				case 'narcobiotic':
					consumables.push(i)
					break
				default:
					console.warn(`Tipo inesperado: ${i.type}`)
			}
		}

		// Assign and return
		event.weapons = weapons
		event.hacks = hacks
		event.cybertechs = cybertechs
		event.armors = armors
		event.consumables = consumables
		event.grenades = grenades
		event.mods = mods
		event.narcobiotics = consumables
	}

	async _removeHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value > 0) {
			await this.actor.update({ 'system.hyperdrive.value': this.actor.system.hyperdrive.value - 1 })
		}
	}

	async _addHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value < 5) {
			await this.actor.update({ 'system.hyperdrive.value': this.actor.system.hyperdrive.value + 1 })
		}
	}

	async _addConsumable(event) {
		event.preventDefault()
		let element = event.currentTarget
		const itemId = element.closest('.item').dataset.itemId
		const item = this.actor.items.get(itemId)
		await item.update({ 'system.quantity': item.system.quantity + 1 })
	}

	async _onItemCreate(event) {
		event.preventDefault()
		let element = event.currentTarget
		if (element.dataset.type === 'weapon') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					damage: '1d6',
					price: 0,
					statusBonus: 'vigor',
				},
			}
			return await Item.create(itemData, { parent: this.actor })
		}
		if (element.dataset.type === 'hack') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					damage: '0',
					causeDamage: false,
					energyCost: 0,
					eqquiped: false,
					statusBonus: 'mind',
				},
			}
			return await Item.create(itemData, { parent: this.actor })
		}
		if (element.dataset.type === 'cybertech') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					damage: '0',
					causeDamage: false,
					energyCost: 0,
					eqquiped: false,
					statusBonus: 'mind',
				},
			}
			return await Item.create(itemData, { parent: this.actor })
		}
		if (element.dataset.type === 'consumable') {
			let foundItem = this.actor.items.find((item) => item.name == element.dataset.name && item.type == element.dataset.type)
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					price: 0,
					quantity: 1,
				},
			}
			if (foundItem) {
				return await foundItem.update({ 'system.quantity': foundItem.system.quantity + 1 })
			} else {
				return await Item.create(itemData, { parent: this.actor })
			}
		}
		if (element.dataset.type === 'grenade') {
			let foundItem = this.actor.items.find((item) => item.name == element.dataset.name && item.type == element.dataset.type)
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					price: 0,
					quantity: 1,
					damage: '1d6',
				},
			}
			if (foundItem) {
				return await foundItem.update({ 'system.quantity': foundItem.system.quantity + 1 })
			} else {
				return await Item.create(itemData, { parent: this.actor })
			}
		}
	}

	async _equipItem(event) {
		event.preventDefault()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)
		await item.update({ 'system.eqquiped': true })
	}

	async _unequipItem(event) {
		event.preventDefault()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)
		await item.update({ 'system.eqquiped': false })
	}

	async _openFolder(event) {
		event.preventDefault()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)
		await item.update({ 'system.openFolder': true })
	}

	async _closeFolder(event) {
		event.preventDefault()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)
		await item.update({ 'system.openFolder': false })
	}

	_onRoll(event) {
		event.preventDefault()
		const element = event.currentTarget
		const dataset = element.dataset

		if (dataset.rollType == 'attribute') {
			let damage = `1d10 + @attributes.${dataset.status}[${game.i18n.localize(`ASTRO.stat.${dataset.status}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode'),
			})
			return roll
		}

		// if (dataset.rollType == 'item') {
		// 	const itemId = element.closest('.item').dataset.itemId
		// 	const item = this.actor.items.get(itemId)
		// 	if (item) return item.roll()
		// }

		if (dataset.rollType === 'weapon') {
			let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
			let damage = `${dataset.roll} + @attributes.${dataset.bonus}[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			})
			return roll
		}

		if (dataset.rollType === 'hack' || dataset.rollType === 'cybertech') {
			let currentEnergy = this.actor.system.values.energy.value
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)

			if (currentEnergy > 0) {
				if (currentEnergy - dataset.energyCost >= 0) {
					this.actor.update({ 'system.values.energy.value': this.actor.system.values.energy.value - dataset.energyCost })

					let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
					let damage = ``

					if (dataset.causeDamage == 'true') {
						if (dataset.bonus === 'none') {
							damage = `${dataset.roll}`
						} else {
							damage = `${dataset.roll} + @attributes.${dataset.bonus}[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
						}
						let roll = new Roll(damage, this.actor.getRollData())
						roll.toMessage({
							speaker: ChatMessage.getSpeaker({ actor: this.actor }),
							flavor: label,
							rollMode: game.settings.get('core', 'rollMode'),
						})
						return roll
					} else if (dataset.causeDamage == 'false') {
						return item.roll()
					}
				} else {
					ui.notifications.error(game.i18n.localize('ASTRO.ui.notifications.lowStamina'))
				}
			} else {
				ui.notifications.error(game.i18n.localize('ASTRO.ui.notifications.noStamina'))
			}
		}

		if (dataset.rollType === 'consumable' || dataset.rollType === 'narcobiotic') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			let quantity = item.system.quantity

			if (quantity >= 2) {
				return item.update({ 'system.quantity': item.system.quantity - 1 }) && item.roll()
			} else {
				return item.delete() && item.roll()
			}
		}

		if (dataset.rollType === 'grenade') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			let quantity = item.system.quantity
			console.log(item)

			let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
			let damage = `${dataset.roll}`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			})
			if (quantity > 1) {
				return roll && item.update({ 'system.quantity': item.system.quantity - 1 })
			} else {
				return roll && item.delete()
			}
		}

		if (dataset.rollType === 'mods') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			if (item) return item.roll()
		}
	}

	_onItemEdit(event) {
		event.preventDefault()
		event.stopPropagation()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)

		item.sheet.render(true)
	}
}
