import AstroprismaItemBase from './item-base.mjs'

const fields = foundry.data.fields

export default class AstroprismaConsumable extends AstroprismaItemBase {
	static defineSchema() {
		const requiredInteger = { required: true, nullable: false, integer: true }
		const parentSchema = super.defineSchema()
		const schema = {
			...parentSchema,
			price: new fields.SchemaField({
				value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			}),
			quantity: new fields.SchemaField({
				value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
			}),
		}

		return schema
	}
}
