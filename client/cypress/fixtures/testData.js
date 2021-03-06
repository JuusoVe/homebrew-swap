
export const user = {
  username: "tester",
  password: "salainen1",
  email: "test@homebrewswap.app"
}

export const login = {
  email: user.email,
  password: user.password
}

export const offer = {
  beerName: "abeer",
  description: "this is a beer. this is a beer. this is a beer. this is a beer. ",
  packageSize: "0.33",
  amount: 6,
  location: {
    lat: 60.1785679,
    lng: 24.7980908,
    asText: "Tapiolan terveysasema, Ahertajantie, Espoo, Suomi"
  },
  recipeLink: "this.is.link",
  reviewLink: "this.also.link",
  imgUrl: "https://res.cloudinary.com/www-homebrewswap-app/image/upload/v1614284065/sad_bottle_crcqob.jpg",
  active: true
}

export const apiUrl = "http://localhost:3001/api/"