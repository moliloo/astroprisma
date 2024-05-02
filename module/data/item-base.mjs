const fields = foundry.data.fields;
export default class AstroprismaItemBase extends foundry.abstract.TypeDataModel {

   static defineSchema() {
     const requiredInteger = { required: true, nullable: false, integer: true };
     const schema = {};

     schema.description = new fields.HTMLField({required: true, blank: true})

     return schema;
   }
 }
 