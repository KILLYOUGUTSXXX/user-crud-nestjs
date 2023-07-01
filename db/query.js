

const password = {
  salt: '23a1531d2826a3cdcc8a7a1e4e226154',
  hash: '2e5aa9985bfd16bc967ab6a462ff8837c8a19d5e552e7393c2841659c0c5699bd91eaabd67ff768eb9c2716108525d77b1973c380b20e9173c123b44b8bdf7c2'
}


const data = {
  user_name: 'aidil',
  email: 'lord.aidilf@gmail.com',
  password: [password.hash, password.salt].join(' '),
  display_name: 'Aidil Febrian',
  birthday: '1998-02-01',
  gender: 'M',
  horoscope: 'Aquarius',
  zodiac: 'Tiger',
  height: 250,
  weight: 60,
  interest: '#HIKING #CODING #XSPORT',
  status: true,
  is_admin: true,
  disable_reason: null,
  created_at: (new Date().getTime() / 1000),
  last_update_at: null
}

db = db.getSiblingDB('social_dev')
db.cl_users.insertOne(data)

db = db.getSiblingDB('social_prod')
db.cl_users.insertOne(data)

db = db.getSiblingDB('social_test')
db.cl_users.insertOne(data)

// All Done ...