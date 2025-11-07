require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');

async function main() {
    await connectDB();
    const file = path.join(__dirname, 'categories.json');
    const categories = JSON.parse(fs.readFileSync(file, 'utf8'));

    let inserted = 0, skipped = 0;
    for (const cat of categories) {
        const res = await Category.updateOne(
            { slug: cat.slug },
            { $setOnInsert: cat },
            { upsert: true }
        );
        // res.upsertedId is set only when a new doc was inserted
        if (res.upsertedId) inserted++;
        else skipped++;
    }

    console.log(`Categories seeding complete. Inserted: ${inserted}, Existing: ${skipped}`);
}

main()
    .then(() => mongoose.connection.close())
    .catch((err) => {
        console.error(err);
        mongoose.connection.close().finally(() => process.exit(1));
    });