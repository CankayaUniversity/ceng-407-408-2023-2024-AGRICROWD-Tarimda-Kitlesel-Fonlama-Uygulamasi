import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './AccountSettings.module.css';
const cities = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Aksaray',
  'Amasya',
  'Ankara',
  'Antalya',
  'Ardahan',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bartın',
  'Batman',
  'Bayburt',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Düzce',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkari',
  'Hatay',
  'Iğdır',
  'Isparta',
  'İstanbul',
  'İzmir',
  'Kahramanmaraş',
  'Karabük',
  'Karaman',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kilis',
  'Kırıkkale',
  'Kırklareli',
  'Kırşehir',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Mardin',
  'Mersin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Osmaniye',
  'Rize',
  'Sakarya',
  'Samsun',
  'Şanlıurfa',
  'Siirt',
  'Sinop',
  'Sivas',
  'Şırnak',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Uşak',
  'Van',
  'Yalova',
  'Yozgat',
  'Zonguldak',
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
                'Content-Type': 'application/json',
              },
              withCredentials: true,
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
        const userDetailsResponse = await axios.get(
          `http://localhost:3001/api/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
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

    if (name === 'name' || name === 'surname') {
      const onlyLetters = value.replace(/[^a-zA-ZğüşöçİĞÜŞÖÇ\s]/g, '');
      setUser((prevState) => ({
        ...prevState,
        [name]: onlyLetters,
      }));
    } else if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setUser((prevState) => ({
          ...prevState,
          [name]: onlyNums,
        }));
      }
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
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
      await axios.put(
        `http://localhost:3001/api/user/${user._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
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
    <div className={styles.container}>
      <h1 className={styles.heading}>Account Settings</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* E-posta */}
        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <label htmlFor='email' className={styles.label}>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              className={styles.input}
              value={user.email || ''}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        {/* Ad */}
        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <label htmlFor='name' className={styles.label}>
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              className={styles.input}
              value={user.name || ''}
              onChange={handleChange}
              pattern='[a-zA-ZğüşöçİĞÜŞÖÇ\s]*'
              title='Rakam ve özel karakter içeremez.'
              maxLength='25'
            />
          </div>
        </div>

        {/* Soyad */}
        <div className={styles.formRow}>
          <div className={styles.formRowInner}>
            <label htmlFor='surname' className={styles.label}>
              Surname
            </label>
            <input
              type='text'
              id='surname'
              name='surname'
              className={styles.input}
              value={user.surname || ''}
              onChange={handleChange}
              pattern='[a-zA-ZğüşöçİĞÜŞÖÇ\s]*'
              title='Rakam ve özel karakter içeremez.'
              maxLength='25'
            />
          </div>
        </div>

        <div className={styles.formSubLayout}>
          {/* Doğum Tarihi */}
          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <label htmlFor='birthDate' className={styles.label}>
                Birthday
              </label>
              <input
                type='date'
                id='birthDate'
                name='birthDate'
                className={styles.input}
                value={user.birthDate ? user.birthDate.slice(0, 10) : ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cinsiyet */}
          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <label htmlFor='gender' className={styles.label}>
                Gender
              </label>
              <select
                id='gender'
                name='gender'
                className={styles.input}
                value={user.gender || ''}
                onChange={handleChange}
              >
                <option value=''>Select</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Rather not say'>Rather not say</option>
              </select>
            </div>
          </div>

          {/* Şehir */}
          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <label htmlFor='city' className={styles.label}>
                City
              </label>
              <select
                id='city'
                name='city'
                className={styles.input}
                value={user.city || ''}
                onChange={handleChange}
              >
                <option value=''>City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Telefon Numarası */}
          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <label htmlFor='phone' className={styles.label}>
                Phone number
              </label>
              <div>
                {/* <span id='basic-addon1'>+90</span> */}
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  className={styles.input}
                  value={user.phone || ''}
                  onChange={handleChange}
                  pattern='\d*'
                  maxLength='10'
                  aria-label='Phone'
                  aria-describedby='basic-addon1'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Güncelleme Butonu */}
        <button className={styles.button} type='submit'>
          Update
        </button>
      </form>
    </div>
  );
}

export default UserPanel;
