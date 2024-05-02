import AstroprismaItemBase from './item-base.mjs'

const fields = foundry.data.fields

export default class AstroprismaHack extends AstroprismaItemBase {
   static defineSchema() {
      const requiredInteger = { required: true, nullable: false, integer: true }
		const schema = super.defineSchema()

      schema.type = new fields.SchemaField({
			name: new fields.StringField({ required: true, blank: true }),
		})

      schema.damage = new fields.SchemaField({
			roll: new fields.StringField({ required: true, blank: true }),
		})

      schema.causeDamage = new fields.SchemaField({
			boolean: new fields.BooleanField({initial: false})
		})

      schema.energyCost = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
		})
      
      return schema
   }
}