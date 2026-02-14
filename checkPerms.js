import mongoose from 'mongoose';
import Permissions from './models/permissionModel.js';

async function checkPermissions() {
  try {
    // Connect to MongoDB (adjust connection string if needed)
    await mongoose.connect('mongodb://127.0.0.1:27017/restaurent-management');

    const ids = [
      '6964a8e9ac7b9098fccd753c',
      '69784cfc3b57cef3a887a941',
      '6964afd8ac7b9098fccd7783'
    ];

    for (const id of ids) {
      const perm = await Permissions.findById(id);
      if (perm) {
        console.log(`ID: ${id} -> Module: ${perm.module}, Label: ${perm.moduleLabel}`);
      } else {
        console.log(`ID: ${id} -> Not found`);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkPermissions();