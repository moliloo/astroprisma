import AstroprismaItemBase from './item-base.mjs'

const fields = foundry.data.fields

export default class AstroprismaOrigin extends AstroprismaItemBase {
	static defineSchema() {
		const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = super.defineSchema()

		schema.name = new fields.StringField({ required: true, blank: true })

		schema.attributes = new fields.SchemaField({
			vigor: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			grace: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			mind: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			tech: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})

		return schema
	}
}
