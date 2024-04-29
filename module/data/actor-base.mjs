export default class AstroprismaActorBase extends foundry.abstract.TypeDataModel {

   static defineSchema() {
     const fields = foundry.data.fields;
     const requiredInteger = { required: true, nullable: false, integer: true };
     const schema = {};
 
     // Values
     schema.health = new fields.SchemaField({
       value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
       max: new fields.NumberField({ ...requiredInteger, initial: 20 })
     });
     schema.energy = new fields.SchemaField({
       value: new fields.NumberField({ ...requiredInteger, initial: 20, min: 0 }),
       max: new fields.NumberField({ ...requiredInteger, initial: 20 })
     });
     schema.armo = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
 
    // Attributes
    schema.vigor = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    schema.grace = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    schema.mind = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    schema.tech = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
     return schema;
   }
 }
 