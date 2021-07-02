const faker = require('faker')
const objectId = require('bson-objectid')

const randomItem = items => items[faker.random.number({ max: items.length - 1 })]

const randomItems = items => [...Array(faker.random.number({ max: items.length - 1 }))].map(() => items[faker.random.number({ max: items.length - 1 })])

// 封装创建假数据的方法
const createOptions = () => {
  const defs = {
    app_name: 'wedn.net',
    app_version: '0.1.0',
    app_description: 'wedn.net site',
    site_url: 'http://localhost:2080/',
    site_name: 'WEDN.NET',
    site_description: 'MAKE IT BETTER!',
    site_favicon: '/favicon.ico',
    site_charset: 'utf-8',
    site_lang: 'zh-CN',
    site_theme: '2016',
    mail_server_hostname: '',
    mail_server_port: '465',
    mail_server_secure: 'true',
    mail_server_name: 'WEDN.NET',
    mail_server_login: '',
    mail_server_password: '',
    last_updated: '2016-12-24T15:42:32'
  }
  return Object.keys(defs).map((k, i) => ({
    id: objectId(),
    key: k,
    value: defs[k],
    enabled: true,
    updated: faker.date.past()
  }))
}

const createUsers = length => [...Array(length)].map(() => ({
  id: objectId(),
  slug: faker.helpers.slugify(faker.name.firstName()),
  username: faker.name.firstName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumberFormat(),
  name: faker.name.findName(),
  status: randomItem(['activated', 'email-unactivated', 'phone-unactivated', 'forbidden']),
  roles: randomItems(['administrator', 'author', 'editor', 'contributor', 'subscriber']),
  created: faker.date.past(),
  updated: faker.date.past(),
  meta: {
    avatar: faker.image.avatar(),
    cover: faker.image.image(),
    bio: faker.lorem.sentence(),
    website: faker.internet.url(),
    location: 'Beijing, China',
    language: randomItem(['zh_CN', 'en_US']),
    last_login: faker.date.past(),
    last_ip: faker.internet.ip()
  }
}))

// 增加 terms 参数，用于设置分类与标签
const createPosts = (length, users, terms) => [...Array(length)].map(() => ({
  id: objectId(),
  slug: faker.lorem.slug(),
  title: faker.lorem.sentence(),
  excerpt: faker.lorem.paragraph(),
  content: faker.lorem.paragraphs(),
  type: randomItem(['blog', 'page']),
  status: randomItem(['published', 'drafted']),
  comment_status: randomItem(['open', 'close']),
  comment_count: faker.random.number({ max: 100 }),
  view_count: faker.random.number({ max: 1000 }),
  // 随机作者（用户信息）
  author: randomItem(users),
  // 添加分类 2 个：
  categories: [
    randomItem(terms.filter(cate => cate.type === 'category')),
    randomItem(terms.filter(cate => cate.type === 'category'))
  ],
  // 添加标签 2 个：
  tags: [
    randomItem(terms.filter(tag => tag.type === 'tag')),
    randomItem(terms.filter(tag => tag.type === 'tag'))
  ],
  parent_id: null,
  created: faker.date.past(),
  updated: faker.date.past(),
  meta: {}
}))

// 去除 posts 参数
const createTerms = (length) => [...Array(length)].map(() => ({
  id: objectId(),
  slug: faker.lorem.slug(),
  name: faker.lorem.word(),
  type: randomItem(['category', 'tag']),
  description: faker.lorem.sentence(),
  count: 1,
  parent_id: null,
  created: faker.date.past(),
  updated: faker.date.past(),
  // 删除关联文章，可后期再进行查询
  meta: {}
}))

const createComments = (length, posts) => [...Array(length)].map(() => ({
  id: objectId(),
  author: faker.name.findName(),
  email: faker.internet.email(),
  ip: faker.internet.ip(),
  content: faker.lorem.paragraph(),
  status: randomItem(['hold', 'rejected', 'approved']),
  user_agent: faker.internet.userAgent(),
  post_id: randomItem(posts).id,
  user_id: 0,
  parent_id: null,
  created: faker.date.past(),
  updated: faker.date.past(),
  meta: {}
}))

// 准备默认用户
const fallbackUsers = [
  {
    slug: 'zce',
    username: 'zce',
    password: 'wanglei',
    email: 'w@zce.me',
    name: 'Wang Lei',
    status: 'activated',
    roles: ['administrator'],
    meta: { avatar: 'https://img.zce.me/avatar/faker.svg' }
  },
  {
    slug: 'admin',
    username: 'admin',
    password: 'admin',
    name: 'Admin',
    status: 'activated',
    roles: ['administrator'],
    meta: { avatar: 'https://img.zce.me/avatar/faker.svg' }
  },
  {
    slug: 'demo',
    username: 'demo',
    password: 'demo',
    name: 'Demo',
    status: 'forbidden',
    roles: ['administrator'],
    meta: { avatar: 'https://img.zce.me/avatar/faker.svg' }
  }
]


module.exports = () => {
  // 创建随机假数据
  const options = createOptions()
  const users = createUsers(80)
  // 删除 posts 参数
  const terms = createTerms(10)
  // 添加 terms 参数
  const posts = createPosts(50, users, terms)
  const comments = createComments(10, posts)

  // 将在假数据中添加上默认的用户
  return { options, users: [...users, ...fallbackUsers], posts, terms, comments }
}

