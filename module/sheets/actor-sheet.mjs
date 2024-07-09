import { astroprisma } from '../helpers/config.mjs'

export class AstroprismaActorSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['astroprisma', 'sheet', 'actor'],
			width: 630,
			height: 670,
			tabs: [{ navSelector: '.tab-nav', contentSelector: '.tab-select', initial: 'description' }],
		})
	}

	get template() {
		return `systems/astroprisma/templates/actor/actor-${this.actor.type}-sheet.hbs`
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
		const items = []

		// Iterate through items, allocating to containers
		for (let i of event.items) {
			i.img = i.img || Item.DEFAULT_ICON

			if (i.type === 'weapon') {
				weapons.push(i)
			} else if (i.type === 'hack') {
				hacks.push(i)
			} else if (i.type === 'item') {
				items.push(i)
			}
		}

		// Assign and return
		event.weapons = weapons
		event.hacks = hacks
		event.items = items
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

	async _onItemCreate(event) {
		event.preventDefault()
		let element = event.currentTarget
		if (element.dataset.type === 'weapon') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					damage: {
						roll: '1d6',
					},
					price: {
						value: 0,
					},
					statusBonus: {
						name: 'vigor',
					},
				},
			}
			return await Item.create(itemData, { parent: this.actor })
		}
		if (element.dataset.type === 'hack') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					damage: {
						roll: '0',
					},
					causeDamage: {
						boolean: false,
					},
					energyCost: {
						value: 0,
					},
					eqquiped: {
						boolean: false,
					},
					statusBonus: {
						name: 'mind',
					},
				},
			}
			return await Item.create(itemData, { parent: this.actor })
		}
		if (element.dataset.type === 'consumable') {
			let itemData = {
				name: game.i18n.localize('ASTRO.actor.itemOption.newItem'),
				type: element.dataset.type,
				system: {
					price: {
						value: 0,
					},
				},
			}
			return await Item.create(itemData, { parent: this.actor })
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
		console.log(event)

		if (dataset.rollType == 'attribute') {
			let damage = `1d10 + @attributes.${dataset.status}.value[${game.i18n.localize(`ASTRO.stat.${dataset.status}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode'),
			})
			return roll
		}

		if (dataset.rollType == 'item') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			if (item) return item.roll()
		}

		if (dataset.rollType == 'weapon') {
			let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
			let damage = `${dataset.roll} + @attributes.${dataset.bonus}.value[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			})
			return roll
		}

		if (dataset.rollType == 'hack') {
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
							damage = `${dataset.roll} + @attributes.${dataset.bonus}.value[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
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
	}

	_onItemEdit(event) {
		event.preventDefault()
		event.stopPropagation()
		console.log(event)
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)

		item.sheet.render(true)
	}
}
