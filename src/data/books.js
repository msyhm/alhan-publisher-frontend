const books = [
  {
    id: 1,
    title: "حقوق تجارت",
    author: "دکتر علی مراد حیدری",
    image: "/src/assets/picture/طرح جلد سیاست کیفری مخدری.png",
    description: "معرفی کتاب حقوق تجارت - این کتاب پوشش جامعی از مباحث حقوق تجارت ارائه می‌دهد.",
    category: "حقوق",
    pages: 320,
    year: 1404,
    isAudio: false,
    // ✅ فیلدهای جدید
    price: "",          // قیمت — خالی یعنی «تماس برای خرید»
    isbn: "",           // شابک
    edition: "اول",    // شماره چاپ
    publisherCity: "قم", // محل نشر
  },
];

export default books;
