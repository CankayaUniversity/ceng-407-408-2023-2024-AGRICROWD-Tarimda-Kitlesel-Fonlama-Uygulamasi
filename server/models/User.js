const mongoose = require('mongoose');
const validator = require('validator');


const UserTable = new mongoose.Schema({
    name: {
        type: String,
        required: false, // ********************
        match: [/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/, 'isim sadece harf içermelidir'],
    },
    surname: {
        type: String,
        required: false,
        match: [/^[a-zA-ZğüşöçİĞÜŞÖÇ\s]+$/, 'soyisim sadece harf içermelidir'],
    },
    birthDate: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        enum: ['Erkek', 'Kadın', 'Belirtmek İstemiyorum'],
        required: false,
    },
    city: {
        type: String,
        required: false,
        enum: [
            'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan',
            'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis',
            'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce',
            'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane',
            'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman',
            'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli',
            'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
            'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop',
            'Sivas', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova',
            'Yozgat', 'Zonguldak'
        ],
    },
    phone: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /\(\+90\)\s\d{3}\s\d{3}\s\d{4}/.test(v);
            },
            message: props => `${props.value} geçerli bir Türkiye telefon numarası değil! Doğru format: (+90) XXX XXX XXXX`
        },
    },
    email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Geçerli bir e-posta adresi giriniz.'],
    },
    password: {
        type: String,
        required: false,
    }
    
});

const UserModel = mongoose.model("User", UserTable);
module.exports = UserModel;