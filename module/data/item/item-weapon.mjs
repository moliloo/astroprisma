import AstroprismaItemBase from './item-base.mjs'

const fields = foundry.data.fields

export default class AstroprismaWeapon extends AstroprismaItemBase {
	static defineSchema() {
		const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = super.defineSchema()

		schema.type = new fields.StringField({ required: true, blank: true })
		
		schema.damage = new fields.StringField({ required: true, blank: true })

		schema.statusBonus = new fields.StringField({ required: true, blank: true })

		schema.price = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })

		return schema
	}
}
