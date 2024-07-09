 export class AstroprismaItemSheet extends ItemSheet {
   /** @override */
   static get defaultOptions() {
     return foundry.utils.mergeObject(super.defaultOptions, {
       classes: ['astroprisma', 'sheet', 'item'],
       width: 300,
       height: 300,
     });
   }
 
   get template() {
      return `systems/astroprisma/templates/item/item-${this.item.type}-sheet.hbs`
   }
 
   /* -------------------------------------------- */
 
   /** @override */
   getData() {
     // Retrieve base data structure.
     const context = super.getData();
 
     // Use a safe clone of the item data for further operations.
     const itemData = context.data;
 
     // Retrieve the roll data for TinyMCE editors.
     context.rollData = this.item.getRollData();
 
     // Add the item's data to context.data for easier access, as well as flags.
     context.system = itemData.system;

     context.enrichedBiography = TextEditor.enrichHTML(this.object.system.description, {async: true});
 
     return context;
   }
 
   /* -------------------------------------------- */
 
   /** @override */
   activateListeners(html) {
     super.activateListeners(html);
 
     // Everything below here is only needed if the sheet is editable
     if (!this.isEditable) return;
 
     // Roll handlers, click handlers, etc. would go here.
 
     // Active Effect management
     html.on('click', '.effect-control', (ev) =>
       onManageActiveEffect(ev, this.item)
     );
   }
 }
 