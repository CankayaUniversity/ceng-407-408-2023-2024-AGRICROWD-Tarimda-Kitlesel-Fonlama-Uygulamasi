import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const cities = [
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
];

function UserPanel() {
  const [user, setUser] = useState({
    email: '',
    name: '',
    surname: '',
    birthDate: '',
    gender: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    const authToken = Cookies.get('authToken');

    const fetchUserId = async () => {
      try {
        if (authToken) {
          const response = await axios.post(
            'http://localhost:3001/api/auth',
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          );
          if (response.data.success) {
            fetchUserDetails(response.data.user._id, authToken);
          } else {
            console.error('Kullanıcı kimliği alınamadı.');
          }
        }

      } catch (error) {
        console.error('Sunucuyla iletişim hatası:', error);
      }
    };

    const fetchUserDetails = async (userId, authToken) => {
      try {
        const userDetailsResponse = await axios.get(`http://localhost:3001/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (userDetailsResponse.data) {
          setUser(userDetailsResponse.data);
        } else {
          console.error('Kullanıcı bilgileri alınamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken bir hata oluştu:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;


    if (name === "name" || name === "surname") {
      const onlyLetters = value.replace(/[^a-zA-ZğüşöçİĞÜŞÖÇ\s]/g, '');
      setUser(prevState => ({
        ...prevState,
        [name]: onlyLetters
      }));
    } else if (name === "phone") {

      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setUser(prevState => ({
          ...prevState,
          [name]: onlyNums
        }));
      }
    } else {

      setUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authToken = Cookies.get('authToken');
    const updatedUser = { ...user };


    if (!updatedUser.password || updatedUser.password.trim() === '') {
      delete updatedUser.password;
    }

    try {
      await axios.put(`http://localhost:3001/api/user/${user._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert('Kullanıcı bilgileri başarıyla güncellendi.');
    } catch (error) {
      console.error('Bilgiler güncellenirken hata oluştu', error);
      alert('Bilgiler güncellenirken bir hata oluştu.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Kullanıcı Paneli, {user.email}</h1>
      <form onSubmit={handleSubmit}>
        {/* E-posta */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-posta</label>
          <input type="email" className="form-control" id="email" name="email" value={user.email || ''} onChange={handleChange} disabled />
        </div>
        {/* Ad */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Ad</label>
          <input type="text" className="form-control" id="name" name="name" value={user.name || ''} onChange={handleChange}
            pattern="[a-zA-ZğüşöçİĞÜŞÖÇ\s]*"
            title="Rakam ve özel karakter içeremez."
            placeholder="Adınız"
            maxLength="25"
          />
        </div>

        {/* Soyad */}
        <div className="mb-3">
          <label htmlFor="surname" className="form-label">Soyad</label>
          <input type="text" className="form-control" id="surname" name="surname" value={user.surname || ''} onChange={handleChange}
            pattern="[a-zA-ZğüşöçİĞÜŞÖÇ\s]*"
            title="Rakam ve özel karakter içeremez."
            placeholder="Soyadınız"
            maxLength="25"
          />
        </div>

        {/* Doğum Tarihi */}
        <div className="mb-3">
          <label htmlFor="birthDate" className="form-label">Doğum Tarihi</label>
          <input type="date" className="form-control" id="birthDate" name="birthDate" value={user.birthDate ? user.birthDate.slice(0, 10) : ''} onChange={handleChange} />
        </div>

        {/* Cinsiyet */}
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Cinsiyet</label>
          <select className="form-select" id="gender" name="gender" value={user.gender || ''} onChange={handleChange}>
            <option value="">Seçiniz...</option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
            <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
          </select>
        </div>

        {/* Şehir */}
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Şehir</label>
          <select className="form-select" id="city" name="city" value={user.city || ''} onChange={handleChange}>
            <option value="">Bir şehir seçin</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Telefon Numarası */}
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Cep Telefon Numarası</label>
          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">+90</span>
            <input type="tel" className="form-control" id="phone" name="phone"
              placeholder="5XX XXX XXXX"
              value={user.phone || ''}
              onChange={handleChange}
              pattern="\d*"
              maxLength="10"
              aria-label="Phone"
              aria-describedby="basic-addon1" />
          </div>
        </div>

        {/* Güncelleme Butonu */}
        <button type="submit" className="btn btn-primary">Bilgileri Güncelle</button>
      </form>
    </div>
  );
}

export default UserPanel;

