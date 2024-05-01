import AstroprismaActorBase from './actor-base.mjs'

export default class AstroprismaNpc extends AstroprismaActorBase {
	
  static defineSchema() {
		const fields = foundry.data.fields
		const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = super.defineSchema()

		schema.biography = new fields.HTMLField()

		schema.health = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 })
		})

		return schema
	}
}
