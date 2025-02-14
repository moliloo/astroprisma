import { astroprisma } from '../../helpers/config.mjs'

export class AstroprismaCharacterSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['astroprisma', 'sheet', 'actor', 'character'],
			width: 360,
			height: 915,
			tabs: [{ navSelector: '.tab-nav', contentSelector: '.tab-select', initial: 'description' }]
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

		context.effects = this.prepareActiveEffectCategories(this.actor.effects)

		this._prepareItems(context)

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.hyper-minus').on('click', this._removeHyperdriveValue.bind(this))
		html.find('.hyper-plus').on('click', this._addHyperdriveValue.bind(this))

		if (!this.isEditable) return

		html.on('click', '.item-toggle-equip', this._equipItem.bind(this))

		html.on('click', '.item-folder-toggle', this._toggleFolder.bind(this))

		html.find('.item-edit').on('click', this._onItemEdit.bind(this))
		html.on('click', '.rollable', this._onRoll.bind(this))

		html.find('.consumable-plus').on('click', this._addConsumable.bind(this))

		html.on('click', '.effect-control', (ev) => this.onManageActiveEffect(ev, this.actor))
		html.find('.effect-display').on('click', this._onActiveEffectDisplayInfo.bind(this))

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
		new ContextMenu(html, '.effect-row', this.effectContextMenu)
	}

	itemContextMenu = [
		{
			name: game.i18n.localize('ASTRO.actor.itemOption.editItem'),
			icon: '<i class="fa-solid fa-pen-to-square"></i>',
			callback: (event) => {
				const item = this.actor.items.get(event[0].attributes[1].nodeValue)
				item.sheet.render(true)
			}
		},
		{
			name: `<span style="color: #d71f30;">${game.i18n.localize('ASTRO.actor.itemOption.deleteItem')}</span>`,
			icon: '<i style="color: #d71f30;" class="fas fa-trash"></i>',
			callback: (event) => {
				const item = this.actor.items.get(event[0].attributes[1].nodeValue)
				item.delete()
			}
		}
	]

	effectContextMenu = [
		{
			name: game.i18n.localize('ASTRO.activeEffect.update'),
			icon: '<i class="fa-solid fa-pen-to-square"></i>',
			callback: (event) => {
				const effect = this.actor.effects.get(event[0].attributes[1].nodeValue)
				effect.sheet.render(true)
			}
		},
		{
			name: `<span style="color: #d71f30;">${game.i18n.localize('ASTRO.activeEffect.delete')}</span>`,
			icon: '<i style="color: #d71f30;" class="fas fa-trash"></i>',
			callback: (event) => {
				const effect = this.actor.effects.get(event[0].attributes[1].nodeValue)
				effect.delete()
			}
		}
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
		const questItems = []

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
				case 'quest-item':
					questItems.push(i)
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
		event.drones = drones
		event.questItems = questItems
	}

	async _removeHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value > 0) {
			await this.actor.update({ 'system.hyperdrive.value': this.actor.system.hyperdrive.value - 1 })
		}
	}

	async _addHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value < this.actor.system.hyperdrive.max) {
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
					statusBonus: 'vigor'
				}
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
					statusBonus: 'mind'
				}
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
					statusBonus: 'mind'
				}
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
					quantity: 1
				}
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
					damage: '1d6'
				}
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
		let scrollPos = $('.tab-select').scrollTop()

		let isCurrentlyEquipped = item.system.eqquiped
		let newEquipState = !isCurrentlyEquipped
		let armorValue = item.type === 'armor' && item.system.eqquiped ? item.system.armor : 0

		await item.update({ 'system.eqquiped': newEquipState })
		$('.tab-select').scrollTop(scrollPos)
		if (item.type === 'armor') {
			await this.actor.update({ 'system.values.armor': armorValue })
			$('.tab-select').scrollTop(scrollPos)
		}

		$('.tab-select').scrollTop(scrollPos)
	}

	async _toggleFolder(event) {
		event.preventDefault()
		let weaponItem = event.currentTarget.closest('.item')
		let description = $(weaponItem).find('.item-info')
		description.toggleClass('invisible')
		let icon = $(event.currentTarget).find('i')
		if (icon.hasClass('fa-folder-open')) {
			icon.removeClass('fa-folder-open').addClass('fa-folder')
		} else {
			icon.removeClass('fa-folder').addClass('fa-folder-open')
		}
	}

	async _onRoll(event) {
		event.preventDefault()
		const element = event.currentTarget
		const dataset = element.dataset
		let actor = this.actor.system.attributes
		let scrollPos = $('.tab-select').scrollTop()

		function getStatusTotal(status) {
			let attribute

			switch (status) {
				case 'vigor':
					attribute = actor.vigor
					break
				case 'grace':
					attribute = actor.grace
					break
				case 'mind':
					attribute = actor.mind
					break
				case 'tech':
					attribute = actor.tech
					break
				default:
					console.warn(`Attribute '${status}' don't find.`)
					return 0
			}
			if (attribute) {
				const value = Number(attribute.value) || 0
				const bonus = Number(attribute.bonus) || 0
				console.log(`Value: ${value}, Bonus: ${bonus}`)
				return value + bonus
			} else {
				console.warn(`Attribute '${status}' don't have valuer or bonues.`)
				return 0
			}
		}

		if (dataset.rollType == 'attribute') {
			let damage = `1d10 + ${getStatusTotal(dataset.status)}[${game.i18n.localize(`ASTRO.stat.${dataset.status}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode')
			})
			return roll
		}

		if (dataset.rollType == 'item') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			if (item) return item.roll()
		}

		if (dataset.rollType === 'weapon') {
			let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
			let damage = `${dataset.roll} + ${getStatusTotal(dataset.bonus)}[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
			let roll = new Roll(damage, this.actor.getRollData())
			roll.toMessage({
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode')
			})
			return roll
		}

		if (dataset.rollType === 'hack' || dataset.rollType === 'cybertech') {
			let currentEnergy = this.actor.system.values.energy.value
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)

			if (currentEnergy > 0) {
				if (currentEnergy - dataset.energyCost >= 0) {
					await this.actor.update({ 'system.values.energy.value': currentEnergy - dataset.energyCost })
					$('.tab-select').scrollTop(scrollPos)

					let label = `<h1><img src='${dataset.img}' height='40' width='40' />${dataset.label}</h1>${dataset.description}`
					let damage = ``

					if (dataset.causeDamage == 'true') {
						if (dataset.bonus === 'none') {
							damage = `${dataset.roll}`
						} else {
							damage = `${dataset.roll} +${getStatusTotal(dataset.bonus)}[${game.i18n.localize(`ASTRO.stat.${dataset.bonus}`)}]`
						}
						let roll = new Roll(damage, this.actor.getRollData())
						roll.toMessage({
							speaker: ChatMessage.getSpeaker({ actor: this.actor }),
							flavor: label,
							rollMode: game.settings.get('core', 'rollMode')
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
				await item.update({ 'system.quantity': item.system.quantity - 1 })
				await item.roll()
				$('.tab-select').scrollTop(scrollPos)
			} else {
				await item.delete()
				await item.roll()
				$('.tab-select').scrollTop(scrollPos)
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
				rollMode: game.settings.get('core', 'rollMode')
			})
			if (quantity > 1) {
				await roll
				await item.update({ 'system.quantity': item.system.quantity - 1 })
				$('.tab-select').scrollTop(scrollPos)
			} else {
				await roll
				await item.delete()
				$('.tab-select').scrollTop(scrollPos)
			}
		}

		if (dataset.rollType === 'mods') {
			const itemId = element.closest('.item').dataset.itemId
			const item = this.actor.items.get(itemId)
			if (item) return item.roll()
		}
	}

	onManageActiveEffect(event, owner) {
		event.preventDefault()
		const a = event.currentTarget
		const li = a.closest('li')
		const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null
		switch (a.dataset.action) {
			case 'create':
				return owner.createEmbeddedDocuments('ActiveEffect', [
					{
						name: game.i18n.format('DOCUMENT.New', {
							type: game.i18n.localize('DOCUMENT.ActiveEffect')
						}),
						icon: 'icons/svg/aura.svg',
						origin: owner.uuid,
						'duration.rounds': li.dataset.effectType === 'temporary' ? 1 : undefined,
						disabled: li.dataset.effectType === 'inactive'
					}
				])
			case 'edit':
				return effect.sheet.render(true)
			case 'delete':
				return effect.delete()
			case 'toggle':
				return effect.update({ disabled: !effect.disabled })
		}
	}

	async _onActiveEffectDisplayInfo(event) {
		event.preventDefault()
		event.stopPropagation()
		let section = event.currentTarget.closest('.effect-row')
		let editor = $(section).find('.effect-description')
		editor.toggleClass('invisible')
	}

	prepareActiveEffectCategories(effects) {
		// Define effect header categories
		const categories = {
			temporary: {
				type: 'temporary',
				label: game.i18n.localize('ASTRO.activeEffect.temporary'),
				effects: []
			},
			passive: {
				type: 'passive',
				label: game.i18n.localize('ASTRO.activeEffect.passive'),
				effects: []
			},
			inactive: {
				type: 'inactive',
				label: game.i18n.localize('ASTRO.activeEffect.inactive'),
				effects: []
			}
		}

		// Iterate over active effects, classifying them into categories
		for (let e of effects) {
			if (e.disabled) categories.inactive.effects.push(e)
			else if (e.isTemporary) categories.temporary.effects.push(e)
			else categories.passive.effects.push(e)
		}
		return categories
	}

	_onItemEdit(event) {
		event.preventDefault()
		event.stopPropagation()
		let itemId = event.currentTarget.closest('.item').dataset.itemId
		let item = this.actor.items.get(itemId)

		item.sheet.render(true)
	}
}
