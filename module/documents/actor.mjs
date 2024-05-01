export class AstroprismaActor extends Actor {
	prepareData() {
		super.prepareData()
	}

	prepareBaseData() {}

	prepareDerivedData() {
		const actorData = this
		const systemData = actorData.system
		const flags = actorData.flags.astroprisma || {}

	}


	getRollData() {
		return { ...super.getRollData(), ...(this.system.getRollData?.() ?? null) }
	}
}
