import AstroprismaItemBase from './item-base.mjs'

const fields = foundry.data.fields

export default class AstroprismaCybertech extends AstroprismaItemBase {
	static defineSchema() {
		const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = super.defineSchema()

		schema.energyCost = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})

		schema.causeDamage = new fields.SchemaField({
			boolean: new fields.BooleanField({ initial: false }),
		})

		schema.damage = new fields.SchemaField({
			roll: new fields.StringField({ required: true, blank: true }),
		})

		schema.statusBonus = new fields.SchemaField({
			name: new fields.StringField({ required: true, blank: true }),
		})

		return schema
	}
}
