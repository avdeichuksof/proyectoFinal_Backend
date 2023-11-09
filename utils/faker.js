import {Faker, en} from '@faker-js/faker'

const faker = new Faker({locale: [en]})
const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(5),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.string.alphanumeric(5),
        stock: faker.helpers.rangeToNumber({min: 1, max: 15}),
        status: true,
        category: faker.helpers.arrayElement(['artist', 'cinema', 'classic', 'flowers', 'geometric', 'hobbies', 'oneline', 'realista', 'varios']),
        id: faker.database.mongodbObjectId()
    }
}

export default generateProduct