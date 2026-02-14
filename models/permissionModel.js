// import mongoose from 'mongoose';

// const PermissionSchema = new mongoose.Schema({
//   module: { type: String, required: true, unique: true },
//   isActive: { type: Boolean, default: true },
//   actions: [{ type: String }] // e.g. "leads.create", "leads.view"
// }, { timestamps: true });

// const Permissions = mongoose.model('Permissions', PermissionSchema);
// export default Permissions;

// import mongoose from 'mongoose';

// const PermissionSchema = new mongoose.Schema({
//   module: { type: String, required: true }, 
//   displayName: { type: String, required: true }, 
//   isActive: { type: Boolean, default: true },

//   actions: [
//     {
//       name: { type: String, required: true }, 
//       key: { type: String, required: true },  
//     }
//   ]
// }, { timestamps: true });

// const Permissions = mongoose.model('Permissions', PermissionSchema);
// export default Permissions;



import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({

  module: { type: String, required: true }, 
  moduleLabel: { type: String, required: true }, 
  icon: { type: String,default:"ri-circle-line" }, 

  isActive: { type: Boolean, default: true },
  submenus: [
    {
      name: { type: String, required: true },       
      label: { type: String, required: true },      
      
      actions: [
        {
          key: { type: String, required: true },    
          label: { type: String, required: true }   
        }
      ]
    }
  ]

}, { timestamps: true });


const Permissions = mongoose.model('Permissions', PermissionSchema);
export default Permissions;
