export class AstroprismaActorSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['astroprisma', 'sheet', 'actor'],
			width: 630,
			height: 780,
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

		this._prepareItems(context);

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.hyper-minus').on('click', this._removeHyperdriveValue.bind(this))
		html.find('.hyper-plus').on('click', this._addHyperdriveValue.bind(this))

		if (!this.isEditable) return
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
	}

	async _prepareItems(event) {
		// Initialize containers.
		const weapons = [];
		const hacks = [];
  
		// Iterate through items, allocating to containers
		for (let i of event.items) {
		  i.img = i.img || Item.DEFAULT_ICON;
		  // Append to gear.
		  if (i.type === 'weapon') {
			weapons.push(i);
		  }
		  // Append to features.
		  else if (i.type === 'hack') {
			 hacks.push(i);
		  }
		}
  
		// Assign and return
		event.weapons = weapons;
		event.hacks = hacks;
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
		event.preventDefault();
		let element = event.currentTarget
		let itemData = {
			name: game.i18n.localize("ASTRO.actor.item.newItem"),
			type: element.dataset.type,
			system: {
				damage: {
					roll: "1d6"
				},
				price: {
					value: 0
				},
				statusBonus: {
					name: "VIGOR"
				},
			}
			
		}

		return await Item.create(itemData, { parent: this.actor });
	 }
  
	 _onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
  
		// Handle item rolls.
		if (dataset.rollType) {
		  if (dataset.rollType == 'item') {
			 const itemId = element.closest('.item').dataset.itemId;
			 const item = this.actor.items.get(itemId);
			 if (item) return item.roll();
		  }
		}
  
		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
		  let label = dataset.label ? `[ability] ${dataset.label}` : '';
		  let roll = new Roll(dataset.roll, this.actor.getRollData());
		  roll.toMessage({
			 speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			 flavor: label,
			 rollMode: game.settings.get('core', 'rollMode'),
		  });
		  return roll;
		}
	 }
  
}
