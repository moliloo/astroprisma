export class AstroprismaActorSheet extends ActorSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['astroprisma', 'sheet', 'actor'],
			width: 630,
			height: 780,
			tabs: [{ navSelector: ".tab-nav", contentSelector: ".tab-select", initial: "description" }]
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

		return context
	}

	activateListeners(html) {
		super.activateListeners(html)

		html.find('.hyper-minus').on('click', this._removeHyperdriveValue.bind(this))
		html.find('.hyper-plus').on('click', this._addHyperdriveValue.bind(this))
	}

	async _removeHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value > 0) {
			await this.actor.update({ 'system.hyperdrive.value': this.actor.system.hyperdrive.value - 1 });
		}
	}

	async _addHyperdriveValue(event) {
		event.preventDefault()
		if (this.actor.system.hyperdrive.value < 5) {
			await this.actor.update({ 'system.hyperdrive.value': this.actor.system.hyperdrive.value + 1 })
		}
	}
}
