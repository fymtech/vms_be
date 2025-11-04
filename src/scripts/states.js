const mongoose = require("mongoose");
// const fs = require("fs");
const States = require("../models/state.model");

const doc = [
  {
    nameAr: "عسير",
    nameEn: "Asir",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "الباحة",
    nameEn: "Al Bahah",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "الجوف",
    nameEn: "Al Jawf",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "المدينة المنورة",
    nameEn: "Al Madinah",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "القصيم",
    nameEn: "Al-Qassim",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "المنطقة الشرقية",
    nameEn: "Eastern Province",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "حائل",
    nameEn: "Hail",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "جازان",
    nameEn: "Jazan",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: " مكة المكرمة",
    nameEn: "Makkah",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "نجران",
    nameEn: "Najran",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "الحدود الشمالية",
    nameEn: "Northern Borders",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "الرياض",
    nameEn: "Riyadh",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
  {
    nameAr: "تبوك",
    nameEn: "Tabuk",
    countryRef: "66e15c36ea0ebbb4c8511fdf",
  },
];
(async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hms_db", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
      });

    // To add data to collection
    const resultDoc_s = await States.create(doc);
    console.log("Document inserted:", resultDoc_s);
  } catch (error) {
    console.error("Error inserting document:", error);
  }
})();

// To retreive data and store locally
// (async () => {
//   try {
//     const resultDoc_s = await States.find();
//     console.log("Document inserted:", resultDoc_s);

//     const jsonData = JSON.stringify(resultDoc_s, null, 2);

//     // Write to the file
//     fs.writeFile("./collections/minute.states.json", jsonData, (err) => {
//       if (err) {
//         console.error("Error writing to file", err);
//       } else {
//         console.log(
//           "File successfully written to ./collections/minute.states.json"
//         );
//       }
//     });
//   } catch (error) {
//     console.error("Error inserting document:", error);
//   }
// })();

// TODO: Replace with Indian states data
