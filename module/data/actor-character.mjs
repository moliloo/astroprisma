import AstroprismaActorBase from "./actor-base.mjs";

const fields = foundry.data.fields;

export default class AstroprismaCharacter extends AstroprismaActorBase {

  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.exp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    
    schema.serum = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });

    schema.origin = new fields.SchemaField({
      name: new fields.SchemaField({
        value: new fields.StringField({ required: true, blank: true })
      }),
    });

    schema.hyperdrive = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    schema.favor = new fields.SchemaField({
      warg: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0})
      }),
      medusa: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0})
      }),
      corsair: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0})
      }),
      synth: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0})
      }),
      isf: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0})
      }),
     })

    return schema;
  }
}
