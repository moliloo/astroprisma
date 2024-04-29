import AstroprismaActorBase from "./actor-base.mjs";

export default class AstroprismaCharacter extends AstroprismaActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.exp = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });

    schema.origin = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.StringField({ required: true, blank: true })
      }),
    });

    schema.hyperdrive = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    return schema;
  }
}
