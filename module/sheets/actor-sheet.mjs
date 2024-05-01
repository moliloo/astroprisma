export class AstroprismaActorSheet extends ActorSheet {
   
   static get defaultOptions() {
      return mergeObject(super.defaultOptions, {
         classes: ['astroprisma', 'sheet', 'actor'],
			width: 600,
			height: 600,
			template: 'systems/astroprisma/templates/actor/actor-character-sheet.hbs'
		})
	}

	getData() {
		const context = super.getData()
		const actorData = context.data

		context.system = actorData.system
		context.config = CONFIG.ASTROPRISMA
		// context.weapons = data.items.filter(function (item) {
		// 	return item.type == 'weapon'
		// })

		// if (actorData.type == 'character') {
		// 	this._prepareItems(context)
		// 	this._prepareCharacterData(context)
		// }

		// if (actorData.type == 'npc') {
		// 	this._prepareItems(context)
		// }

		return context
	}

	// _prepareItems(context) {
	// 	const weapons = []
	// 	const hacks = []

	// 	for (let i of context.items) {
	// 		i.img = i.img || Item.DEFAULT_ICON
	// 		if (i.type === 'weapon') {
	// 			weapons.push(i)
	// 		} else if (i.type === 'hack') {
	// 			hacks.push(i)
	// 		}
	// 	}

	// 	context.weapons = weapons
	// 	context.hacks = hacks
	// }

	// _prepareCharacterData(context) {
	// 	for (let [k, v] of Object.entries(context.system.statsTypes)) {
	// 		v.label = game.i18n.localize(CONFIG.ASTROPRISMA.statsTypes[k]) ?? k
	// 	}
	// }

	activateListeners(html) {
		super.activateListeners(html)

		html.on('click', '.item-edit', (ev) => {
			const li = $(ev.currentTarget).parents('.item')
			const item = this.actor.items.get(li.data('itemId'))
			item.sheet.render(true)
		})

		if (!this.isEditable) return

		html.on('click', '.item-create', this._onItemCreate.bind(this))

		html.on('click', '.item-delete', (ev) => {
			const li = $(ev.currentTarget).parents('.item')
			const item = this.actor.items.get(li.data('itemId'))
			item.delete()
			li.slideUp(200, () => this.render(false))
		})

      html.on('click', '.rollable', this._onRoll.bind(this));

      if (this.actor.isOwner) {
         let handler = (ev) => this._onDragStart(ev);
         html.find('li.item').each((i, li) => {
           if (li.classList.contains('inventory-header')) return;
           li.setAttribute('draggable', true);
           li.addEventListener('dragstart', handler, false);
         });
       }
	}
   
   async _onItemCreate(event) {
      event.preventDefault();
      const header = event.currentTarget;
      const type = header.dataset.type;
      const data = duplicate(header.dataset);
      const name = `New ${type.capitalize()}`;
      const itemData = {
        name: name,
        type: type,
        system: data,
      };

      delete itemData.system['type'];
  
      return await Item.create(itemData, { parent: this.actor });
    }

    _onRoll(event) {
      event.preventDefault();
      const element = event.currentTarget;
      const dataset = element.dataset;
  
      if (dataset.rollType) {
        if (dataset.rollType == 'item') {
          const itemId = element.closest('.item').dataset.itemId;
          const item = this.actor.items.get(itemId);
          if (item) return item.roll();
        }
      }
  
      if (dataset.roll) {
        let label = dataset.label ? `[statsTypes] ${dataset.label}` : '';
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
