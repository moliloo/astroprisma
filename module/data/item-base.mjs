const fields = foundry.data.fields
export default class AstroprismaItemBase extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const schema = {}

		schema.description = new fields.HTMLField({ required: true, blank: true, initial: 'Description' })

		schema.eqquiped = new fields.SchemaField({
			boolean: new fields.BooleanField({initial: false})
		})

		return schema
	}
}
