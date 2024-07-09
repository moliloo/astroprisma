const fields = foundry.data.fields
export default class AstroprismaItemBase extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const schema = {
			description: new fields.HTMLField({ required: true, blank: true, initial: 'Description' }),
			eqquiped: new fields.BooleanField({initial: false}),
			openFolder: new fields.BooleanField({initial: false})
		}
		
		return schema
	}
}
