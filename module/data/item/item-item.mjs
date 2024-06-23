const fields = foundry.data.fields
export default class AstroprismaItemBase extends foundry.abstract.TypeDataModel {
	static defineSchema() {
      const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = {}

		schema.price = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})

      schema.type = new fields.SchemaField({
			name: new fields.StringField({ required: true, blank: true }),
		})

		return schema
	}
}