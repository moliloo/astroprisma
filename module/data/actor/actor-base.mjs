const fields = foundry.data.fields
export default class AstroprismaActorBase extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = {}

		// Values
		schema.values = new fields.SchemaField({
			health: new fields.SchemaField({
				value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
				max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
			}),
			energy: new fields.SchemaField({
				value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
				max: new fields.NumberField({ ...requiredInteger, initial: 20 }),
			}),
			armor: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})

		schema.attributes = new fields.SchemaField({
			vigor: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			grace: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			mind: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			tech: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})

		schema.biography = new fields.HTMLField({ required: true, blank: true, initial: 'Biography' })

		return schema
	}
}
