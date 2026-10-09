// ============================================
// nav.js — полный перевод + все фишки
// ============================================

const TRANSLATIONS = {
  ru: {
    // NAV
    'nav.home': 'Главная', 'nav.cabinet': 'Мой кабинет',
    'nav.orders': 'Мои заказы', 'nav.new_order': 'Новый заказ',
    'nav.profile': '👤 Профиль', 'nav.logout': 'Выйти',
    'nav.login': 'Войти', 'nav.register': 'Регистрация',
    'nav.courier': '🚴 Стать курьером',
    // Приветствия
    'greeting.night': 'Доброй ночи', 'greeting.morning': 'Доброе утро',
    'greeting.day': 'Добрый день', 'greeting.evening': 'Добрый вечер',
    // Тосты
    'toast.light': '☀️ Светлая', 'toast.dark': '🌙 Тёмная', 'toast.sepia': '📜 Сепия',
    'toast.ru': '🇷🇺 Русский', 'toast.en': '🇬🇧 English',
    // Hero
    'hero.tagline': 'Пунктуальность — высшая форма уважения',
    'hero.order': 'Заказать доставку', 'hero.courier': 'Стать курьером',
    'promo.text': '🔥 Скидка 20% на первую доставку!',
    // Статистика
    'stats.deliveries': 'Доставок в год', 'stats.clients': 'Довольных клиентов',
    'stats.time': 'Среднее время', 'stats.always': 'Работаем всегда',
    // Преимущества
    'features.title': 'Почему выбирают нас',
    'features.subtitle': 'Мы делаем доставку простой, быстрой и надёжной',
    'features.fast': 'Быстро', 'features.fast_desc': 'Доставка от 30 минут по городу. Курьер приезжает в течение часа.',
    'features.safe': 'Надёжно', 'features.safe_desc': 'Все курьеры проверены. Груз застрахован на всё время доставки.',
    'features.cheap': 'Выгодно', 'features.cheap_desc': 'Честные цены без скрытых платежей.',
    'features.track': 'Отслеживание', 'features.track_desc': 'Смотрите статус заказа в личном кабинете.',
    // Достижения
    'achievements.title': 'Наши достижения', 'achievements.subtitle': 'Цифры, которыми мы гордимся',
    'ach.1': 'лет на рынке доставки', 'ach.2': 'средняя оценка клиентов',
    'ach.3': 'выполненных доставок', 'ach.4': 'компаний-партнёров',
    // Партнёры
    'partners.title': 'Нам доверяют',
    // Галерея
    'gallery.title': 'Примеры наших доставок', 'gallery.subtitle': 'Каждый день мы доставляем тысячи разных грузов',
    'gallery.docs': 'Документы', 'gallery.docs_desc': 'Важные бумаги — быстро и безопасно',
    'gallery.parcels': 'Посылки', 'gallery.parcels_desc': 'Коробки и грузы до 10 кг',
    'gallery.products': 'Продукты', 'gallery.products_desc': 'Свежие продукты из магазина',
    'gallery.gifts': 'Подарки', 'gallery.gifts_desc': 'Цветы и сюрпризы точно в срок',
    'gallery.business': 'Бизнесу', 'gallery.business_desc': 'Корпоративная доставка',
    'gallery.couriers': 'Наши курьеры', 'gallery.couriers_desc': 'Вежливые и пунктуальные',
    // Услуги
    'services.title': 'Наши услуги', 'services.subtitle': 'Выберите подходящий формат доставки',
    'services.docs': 'Документы', 'services.docs_desc': 'Быстрая доставка важных бумаг и договоров.',
    'services.parcels': 'Посылки', 'services.parcels_desc': 'Доставка небольших грузов до 10 кг.',
    'services.products': 'Продукты', 'services.products_desc': 'Курьер купит и привезёт продукты из магазина.',
    'services.gifts': 'Подарки', 'services.gifts_desc': 'Доставка подарков и цветов в нужное время.',
    'services.business': 'Бизнесу', 'services.business_desc': 'Корпоративная доставка со специальными тарифами.',
    'services.urgent': 'Срочно', 'services.urgent_desc': 'Экспресс-доставка за 60 минут.',
    'price.from250': 'от 250 ₽', 'price.from350': 'от 350 ₽', 'price.from300': 'от 300 ₽',
    'price.from400': 'от 400 ₽', 'price.from600': 'от 600 ₽', 'price.contract': 'по договору',
    // Шаги
    'steps.title': 'Как это работает', 'steps.subtitle': 'Четыре простых шага до вашей посылки',
    'step.1': 'Регистрация', 'step.1_desc': 'Создайте аккаунт за 1 минуту',
    'step.2': 'Оформление', 'step.2_desc': 'Укажите адреса и опишите груз',
    'step.3': 'Оплата', 'step.3_desc': 'Выберите удобный способ оплаты',
    'step.4': 'Доставка', 'step.4_desc': 'Курьер привезёт точно в срок',
    // Отзывы
    'reviews.title': 'Что говорят клиенты', 'reviews.subtitle': 'Нам доверяют тысячи людей',
    'rev.1': 'Заказывал доставку документов. Курьер приехал через 40 минут. Всё чётко!',
    'rev.2': 'Очень удобный сервис. Заказала продукты — привезли через час. Спасибо!',
    'rev.3': 'Пользуюсь для бизнеса. Всегда в срок, есть отчётность. Отличный сервис!',
    'city.moscow': 'Москва', 'city.spb': 'Санкт-Петербург', 'city.kazan': 'Казань',
    // CTA
    'cta.title': 'Готовы оформить заказ?', 'cta.subtitle': 'Это займёт меньше минуты',
    'cta.btn': 'Заказать доставку',
    // Футер
    'footer.about': 'Курьерская доставка нового поколения. Быстро, надёжно, удобно.',
    'footer.services': 'Услуги', 'footer.docs': 'Документы', 'footer.parcels': 'Посылки',
    'footer.products': 'Продукты', 'footer.gifts': 'Подарки',
    'footer.company': 'Компания', 'footer.about_us': 'О нас',
    'footer.become': 'Стать курьером', 'footer.contacts': 'Контакты', 'footer.partners': 'Партнёрам',
    'footer.clients': 'Клиентам', 'footer.order': 'Заказать доставку',
    'footer.my_orders': 'Мои заказы', 'footer.reg': 'Регистрация', 'footer.login': 'Войти',
    'footer.rights': '© 2026 Tempore — Все права защищены.',

    // ===== ФОРМЫ =====
    'form.login.title': 'Вход в систему',
    'form.login.subtitle': 'Введите данные вашего аккаунта',
    'form.email': 'Email',
    'form.password': 'Пароль',
    'form.login_btn': 'Войти',
    'form.or': 'ИЛИ',
    'form.register': 'Регистрация',
    'form.as_courier': 'Курьером',
    'form.reg.title': 'Регистрация',
    'form.reg.subtitle': 'Создайте аккаунт за 1 минуту',
    'form.fullname': 'ФИО *',
    'form.phone': 'Телефон *',
    'form.city': 'Город',
    'form.address': 'Адрес',
    'form.reg_btn': 'Зарегистрироваться',
    'form.have_account': 'Уже есть аккаунт?',

    // ===== ЗАКАЗ =====
    'order.title': 'Оформить заказ',
    'order.subtitle': 'Цена рассчитывается автоматически',
    'order.from': 'Откуда везти *',
    'order.to': 'Куда везти *',
    'order.what': 'Что везём? (опишите груз)',
    'order.urgency': 'Насколько срочно? *',
    'order.payment': 'Способ оплаты *',
    'order.price': 'Стоимость доставки:',
    'order.create': 'Создать заказ',
    'order.quick_docs': 'Документы',
    'order.quick_food': 'Продукты',
    'order.quick_gift': 'Подарок',
    'order.quick_parcel': 'Посылка',
    'order.quick_business': 'Бизнесу',
    'order.urgent_asap': 'Срочно',
    'order.urgent_2h': '2 часа',
    'order.urgent_today': 'Сегодня',
    'order.urgent_tomorrow': 'Завтра',
    'order.pay_card': 'Банковская карта (−5%)',
    'order.pay_online': 'Онлайн-оплата (−5%)',
    'order.pay_cash': 'Наличные курьеру',
    'order.fill': 'Заполните адреса, чтобы увидеть цену',

    // ===== СПИСОК ЗАКАЗОВ =====
    'orders.title': 'Мои заказы',
    'orders.new': '+ Новый заказ',
    'orders.empty': 'У вас пока нет заказов',
    'orders.empty_desc': 'Оформите первый заказ — это займёт минуту',
    'orders.loading': 'Загрузка...',

    // ===== ПРОФИЛЬ =====
    'profile.title': 'Личный кабинет',
    'profile.personal': 'Личные данные',
    'profile.edit': 'Редактировать',
    'profile.save': 'Сохранить',
    'profile.cancel': 'Отмена',
    'profile.total_orders': 'Всего заказов',
    'profile.active': 'Активных',
    'profile.spent': 'Потрачено',
    'profile.fullname': 'ФИО',
    'profile.email': 'Email',
    'profile.phone': 'Телефон',
    'profile.city': 'Город',
    'profile.address': 'Адрес',
    'profile.reg_date': 'Дата регистрации',
    'profile.new_order': 'Новый заказ',
    'profile.my_orders': 'Мои заказы',
    'profile.logout': 'Выйти',

    // ===== КУРЬЕР =====
    'courier.become': 'Стать курьером',
    'courier.subtitle': 'Присоединяйтесь к команде — это займёт минуту',
    'courier.transport': 'Вид транспорта *',
    'courier.register_btn': 'Зарегистрироваться',
    'courier.iam_client': 'Я клиент',
    'courier.photo_hint': 'Нажмите, чтобы загрузить фото',
    'courier.my_orders': 'Мои заказы',
    'courier.reviews': 'Отзывы и рейтинг',
    'courier.profile': 'Профиль курьера',
    'courier.rating_avg': 'Средняя оценка от клиентов',
    'courier.no_reviews': 'Пока нет отзывов',
    'courier.total': 'Всего заказов',
    'courier.active_orders': 'Активных',
    'courier.completed': 'Завершено',
    'courier.earned': 'Заработано',
    'courier.status': 'Статус работы',
    'courier.registered': 'Дата регистрации',
    'courier.experience': 'Стаж работы',
    'courier.badge_free': 'Свободен',
    'courier.badge_busy': 'Занят',
    'courier.badge_inactive': 'Неактивен',
    'courier.take_order': 'Выехал на заказ',
    'courier.delivered': 'Доставлено',
    'courier.no_orders': 'Нет назначенных заказов',
    'courier.photo_upload': 'Нажмите на круг, чтобы загрузить фото',
    'courier.transport_foot': 'Пеший',
    'courier.transport_bike': 'Вело',
    'courier.transport_car': 'Авто',
    'courier.transport_moto': 'Мото',

    // Статусы
    'status.новый': 'новый', 'status.принят': 'принят', 'status.в-пути': 'в пути',
    'status.доставлен': 'доставлен', 'status.отменён': 'отменён',

    // Общие
    'common.cancel_order': 'Отменить заказ',
    'common.leave_review': 'Оставить отзыв',
    'common.review_left': 'Отзыв оставлен',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка'
  },

  en: {
    // NAV
    'nav.home': 'Home', 'nav.cabinet': 'My cabinet',
    'nav.orders': 'My orders', 'nav.new_order': 'New order',
    'nav.profile': '👤 Profile', 'nav.logout': 'Logout',
    'nav.login': 'Login', 'nav.register': 'Sign up',
    'nav.courier': '🚴 Become a courier',
    // Greetings
    'greeting.night': 'Good night', 'greeting.morning': 'Good morning',
    'greeting.day': 'Good afternoon', 'greeting.evening': 'Good evening',
    // Toasts
    'toast.light': '☀️ Light', 'toast.dark': '🌙 Dark', 'toast.sepia': '📜 Sepia',
    'toast.ru': '🇷🇺 Русский', 'toast.en': '🇬🇧 English',
    // Hero
    'hero.tagline': 'Punctuality is the highest form of respect',
    'hero.order': 'Order delivery', 'hero.courier': 'Become a courier',
    'promo.text': '🔥 20% off on your first delivery!',
    // Stats
    'stats.deliveries': 'Deliveries per year', 'stats.clients': 'Satisfied clients',
    'stats.time': 'Average time', 'stats.always': 'We work always',
    // Features
    'features.title': 'Why choose us',
    'features.subtitle': 'We make delivery simple, fast and reliable',
    'features.fast': 'Fast', 'features.fast_desc': 'Delivery from 30 minutes around the city.',
    'features.safe': 'Reliable', 'features.safe_desc': 'Couriers verified, cargo insured.',
    'features.cheap': 'Affordable', 'features.cheap_desc': 'Fair prices without hidden fees.',
    'features.track': 'Tracking', 'features.track_desc': 'Track your order in real time.',
    // Achievements
    'achievements.title': 'Our achievements', 'achievements.subtitle': 'Numbers we are proud of',
    'ach.1': 'years on delivery market', 'ach.2': 'average client rating',
    'ach.3': 'completed deliveries', 'ach.4': 'partner companies',
    // Partners
    'partners.title': 'Trusted by',
    // Gallery
    'gallery.title': 'Examples of our deliveries', 'gallery.subtitle': 'We deliver thousands of different packages',
    'gallery.docs': 'Documents', 'gallery.docs_desc': 'Important papers — fast and safe',
    'gallery.parcels': 'Parcels', 'gallery.parcels_desc': 'Boxes and cargo up to 10 kg',
    'gallery.products': 'Groceries', 'gallery.products_desc': 'Fresh groceries from the store',
    'gallery.gifts': 'Gifts', 'gallery.gifts_desc': 'Flowers and surprises on time',
    'gallery.business': 'Business', 'gallery.business_desc': 'Corporate delivery',
    'gallery.couriers': 'Our couriers', 'gallery.couriers_desc': 'Polite and punctual',
    // Services
    'services.title': 'Our services', 'services.subtitle': 'Choose the right delivery format',
    'services.docs': 'Documents', 'services.docs_desc': 'Fast delivery of important papers.',
    'services.parcels': 'Parcels', 'services.parcels_desc': 'Delivery of small cargo up to 10 kg.',
    'services.products': 'Groceries', 'services.products_desc': 'Courier buys and delivers groceries.',
    'services.gifts': 'Gifts', 'services.gifts_desc': 'Delivery of gifts and flowers.',
    'services.business': 'Business', 'services.business_desc': 'Corporate tariffs.',
    'services.urgent': 'Urgent', 'services.urgent_desc': 'Express delivery in 60 minutes.',
    'price.from250': 'from 250 ₽', 'price.from350': 'from 350 ₽', 'price.from300': 'from 300 ₽',
    'price.from400': 'from 400 ₽', 'price.from600': 'from 600 ₽', 'price.contract': 'by contract',
    // Steps
    'steps.title': 'How it works', 'steps.subtitle': 'Four simple steps to your package',
    'step.1': 'Sign up', 'step.1_desc': 'Create an account in 1 minute',
    'step.2': 'Order', 'step.2_desc': 'Specify addresses and describe cargo',
    'step.3': 'Payment', 'step.3_desc': 'Choose a convenient payment method',
    'step.4': 'Delivery', 'step.4_desc': 'Courier will deliver on time',
    // Reviews
    'reviews.title': 'What clients say', 'reviews.subtitle': 'Thousands trust us',
    'rev.1': 'Courier arrived in 40 minutes. Everything is perfect!',
    'rev.2': 'Ordered groceries — delivered in an hour. Thanks!',
    'rev.3': 'Using it for business. Always on time!',
    'city.moscow': 'Moscow', 'city.spb': 'Saint Petersburg', 'city.kazan': 'Kazan',
    // CTA
    'cta.title': 'Ready to place an order?', 'cta.subtitle': 'It takes less than a minute',
    'cta.btn': 'Order delivery',
    // Footer
    'footer.about': 'Next-generation courier delivery.',
    'footer.services': 'Services', 'footer.docs': 'Documents', 'footer.parcels': 'Parcels',
    'footer.products': 'Groceries', 'footer.gifts': 'Gifts',
    'footer.company': 'Company', 'footer.about_us': 'About us',
    'footer.become': 'Become a courier', 'footer.contacts': 'Contacts', 'footer.partners': 'Partners',
    'footer.clients': 'Clients', 'footer.order': 'Order delivery',
    'footer.my_orders': 'My orders', 'footer.reg': 'Sign up', 'footer.login': 'Login',
    'footer.rights': '© 2026 Tempore — All rights reserved.',

    // Forms
    'form.login.title': 'Sign in', 'form.login.subtitle': 'Enter your account details',
    'form.email': 'Email', 'form.password': 'Password', 'form.login_btn': 'Sign in',
    'form.or': 'OR', 'form.register': 'Sign up', 'form.as_courier': 'As courier',
    'form.reg.title': 'Sign up', 'form.reg.subtitle': 'Create an account in 1 minute',
    'form.fullname': 'Full name *', 'form.phone': 'Phone *', 'form.city': 'City', 'form.address': 'Address',
    'form.reg_btn': 'Sign up', 'form.have_account': 'Already have an account?',

    // Order
    'order.title': 'Place an order', 'order.subtitle': 'The price is calculated automatically',
    'order.from': 'From *', 'order.to': 'To *',
    'order.what': 'What to deliver? (describe the cargo)', 'order.urgency': 'How urgent? *',
    'order.payment': 'Payment method *', 'order.price': 'Delivery cost:',
    'order.create': 'Place order',
    'order.quick_docs': 'Documents', 'order.quick_food': 'Groceries',
    'order.quick_gift': 'Gift', 'order.quick_parcel': 'Parcel', 'order.quick_business': 'Business',
    'order.urgent_asap': 'Urgent', 'order.urgent_2h': '2 hours',
    'order.urgent_today': 'Today', 'order.urgent_tomorrow': 'Tomorrow',
    'order.pay_card': 'Bank card (−5%)', 'order.pay_online': 'Online payment (−5%)',
    'order.pay_cash': 'Cash to courier',
    'order.fill': 'Fill in addresses to see price',

    // Orders
    'orders.title': 'My orders', 'orders.new': '+ New order',
    'orders.empty': 'You have no orders yet', 'orders.empty_desc': 'Place your first order',
    'orders.loading': 'Loading...',

    // Profile
    'profile.title': 'My account', 'profile.personal': 'Personal data',
    'profile.edit': 'Edit', 'profile.save': 'Save', 'profile.cancel': 'Cancel',
    'profile.total_orders': 'Total orders', 'profile.active': 'Active', 'profile.spent': 'Spent',
    'profile.fullname': 'Full name', 'profile.email': 'Email', 'profile.phone': 'Phone',
    'profile.city': 'City', 'profile.address': 'Address', 'profile.reg_date': 'Registration date',
    'profile.new_order': 'New order', 'profile.my_orders': 'My orders', 'profile.logout': 'Logout',

    // Courier
    'courier.become': 'Become a courier', 'courier.subtitle': 'Join the team',
    'courier.transport': 'Transport type *', 'courier.register_btn': 'Sign up',
    'courier.iam_client': 'I am a client', 'courier.photo_hint': 'Click to upload a photo',
    'courier.my_orders': 'My orders', 'courier.reviews': 'Reviews & rating',
    'courier.profile': 'Courier profile', 'courier.rating_avg': 'Average client rating',
    'courier.no_reviews': 'No reviews yet', 'courier.total': 'Total orders',
    'courier.active_orders': 'Active', 'courier.completed': 'Completed', 'courier.earned': 'Earned',
    'courier.status': 'Work status', 'courier.registered': 'Registration date',
    'courier.experience': 'Experience',
    'courier.badge_free': 'Available', 'courier.badge_busy': 'Busy', 'courier.badge_inactive': 'Inactive',
    'courier.take_order': 'On the way', 'courier.delivered': 'Delivered',
    'courier.no_orders': 'No assigned orders',
    'courier.photo_upload': 'Click the circle to upload a photo',
    'courier.transport_foot': 'On foot', 'courier.transport_bike': 'Bike',
    'courier.transport_car': 'Car', 'courier.transport_moto': 'Moto',

    // Statuses
    'status.новый': 'new', 'status.принят': 'accepted', 'status.в-пути': 'in transit',
    'status.доставлен': 'delivered', 'status.отменён': 'cancelled',

    // Common
    'common.cancel_order': 'Cancel order', 'common.leave_review': 'Leave a review',
    'common.review_left': 'Review left', 'common.loading': 'Loading...', 'common.error': 'Error'
  }
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'ru';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.placeholder) el.placeholder = text;
    } else {
      el.textContent = text;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const titleKey = document.querySelector('title')?.dataset.i18nTitle;
  if (titleKey) document.title = t(titleKey);
}

window.t = t;
window.applyTranslations = applyTranslations;

(function() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userData = localStorage.getItem('user');
  let user = null;
  if (userData) { try { user = JSON.parse(userData); } catch(e) {} }

  let menuHtml = '<a href="/index.html" data-page="index" data-i18n="nav.home">Главная</a>';
  let rightHtml = '';
  const isLoggedIn = token && user;

  if (isLoggedIn) {
    if (role === 'courier') {
      menuHtml += '<a href="/courier-profile.html" data-page="courier-profile" data-i18n="nav.cabinet">Мой кабинет</a>';
    } else {
      menuHtml += '<a href="/orders.html" data-page="orders" data-i18n="nav.orders">Мои заказы</a>';
      menuHtml += '<a href="/order.html" data-page="order" data-i18n="nav.new_order">Новый заказ</a>';
      menuHtml += '<a href="/profile.html" data-page="profile" data-i18n="nav.profile">👤 Профиль</a>';
    }
    rightHtml =
      '<div class="navbar-user">' +
        '<span class="navbar-username" id="navGreeting"></span>' +
        '<button class="btn-logout" onclick="logout()" data-i18n="nav.logout">Выйти</button>' +
      '</div>';
  } else {
    menuHtml += '<a href="/courier-register.html" data-page="courier-register" data-i18n="nav.courier">🚴 Стать курьером</a>';
    rightHtml =
      '<div class="navbar-user">' +
        '<a href="/login.html" class="btn-login" data-i18n="nav.login">Войти</a>' +
        '<a href="/register.html" class="btn-register" data-i18n="nav.register">Регистрация</a>' +
      '</div>';
  }

  const controlsHtml =
    '<div class="navbar-controls">' +
      '<span class="nav-date" id="navDate"></span>' +
      '<button class="nav-icon-btn" id="langBtn" onclick="toggleLang()" title="Language">🌐 <span id="langLabel">RU</span></button>' +
      '<button class="nav-icon-btn" id="themeBtn" onclick="cycleTheme()" title="Theme">🎨</button>' +
    '</div>';

  const navbarHtml =
    '<nav class="navbar">' +
      '<div class="navbar-inner">' +
        '<a href="/index.html" class="navbar-logo">⏱ TEMPORE</a>' +
        '<div class="navbar-menu">' + menuHtml + rightHtml + '</div>' +
        controlsHtml +
      '</div>' +
    '</nav>';

  const preloaderHtml =
    '<div id="preloader">' +
      '<div class="loader-logo">⏱ TEMPORE</div>' +
      '<div class="loader-bar"><div class="loader-bar-fill"></div></div>' +
    '</div>';

  const progressHtml = '<div id="scrollProgress"></div>';
  const toTopHtml = '<button id="toTop" onclick="window.scrollTo({top:0, behavior:\'smooth\'})">↑</button>';
  const cursorHtml = '<div class="custom-cursor" id="customCursor"></div><div class="custom-cursor-dot" id="customCursorDot"></div>';
  const confettiCanvas = '<canvas id="confettiCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:9996;display:none;"></canvas>';

  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('preloader')) document.body.insertAdjacentHTML('afterbegin', preloaderHtml);
    if (!document.getElementById('scrollProgress')) document.body.insertAdjacentHTML('afterbegin', progressHtml);
    if (!document.getElementById('toTop')) document.body.insertAdjacentHTML('beforeend', toTopHtml);
    if (!document.getElementById('customCursorDot')) {
      document.body.insertAdjacentHTML('beforeend', cursorHtml);
      document.body.insertAdjacentHTML('beforeend', confettiCanvas);
    }

    document.body.insertAdjacentHTML('afterbegin', navbarHtml);

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const savedLang = localStorage.getItem('lang') || 'ru';
    document.documentElement.setAttribute('data-lang', savedLang);
    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = savedLang.toUpperCase();

    updateGreeting();
    updateDate();
    applyTranslations();

    setTimeout(() => {
      const pl = document.getElementById('preloader');
      if (pl) pl.classList.add('hidden');
    }, 800);

    const currentPage = window.location.pathname.replace('/', '').replace('.html', '') || 'index';
    document.querySelectorAll('.navbar-menu a[data-page]').forEach(a => {
      if (a.dataset.page === currentPage) a.classList.add('active-page');
    });

    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      const sp = document.getElementById('scrollProgress');
      if (sp) sp.style.width = p + '%';
      const tt = document.getElementById('toTop');
      if (tt) tt.classList.toggle('visible', window.scrollY > 400);
    });

    const revealEls = document.querySelectorAll('.reveal, .page-container, .info-card, .order-card, .stat-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.05 });
    revealEls.forEach((el, i) => {
      if (!el.classList.contains('visible')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = (i * 0.04) + 's';
        observer.observe(el);
      }
    });

    initCustomCursor();
    initClickSounds();
  });

  function updateGreeting() {
    const greetEl = document.getElementById('navGreeting');
    if (!greetEl) return;
    const hour = new Date().getHours();
    let greetKey = 'greeting.day';
    if (hour < 6) greetKey = 'greeting.night';
    else if (hour < 12) greetKey = 'greeting.morning';
    else if (hour < 18) greetKey = 'greeting.day';
    else greetKey = 'greeting.evening';

    if (user && user.full_name) {
      const firstName = user.full_name.split(' ')[0];
      greetEl.textContent = t(greetKey) + ', ' + firstName + '!';
    }
  }
  window.updateGreeting = updateGreeting;

  function updateDate() {
    const el = document.getElementById('navDate');
    if (!el) return;
    const d = new Date();
    const lang = localStorage.getItem('lang') || 'ru';
    const locale = lang === 'en' ? 'en-US' : 'ru-RU';
    el.textContent = '📅 ' + d.toLocaleDateString(locale, { day: '2-digit', month: 'short' });
  }
  window.updateDate = updateDate;

  function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const dot = document.getElementById('customCursorDot');
    if (!cursor || !dot) return;
    if (window.innerWidth < 768) { cursor.style.display = 'none'; dot.style.display = 'none'; return; }

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animate() {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, input, select, textarea, .gallery-item, .service, .feature, .review, .order-card, .urgency-option, .transport-option, .achievement, .zone-item')) {
        cursor.classList.add('cursor-hover');
        dot.classList.add('dot-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, input, select, textarea, .gallery-item, .service, .feature, .review, .order-card, .urgency-option, .transport-option, .achievement, .zone-item')) {
        cursor.classList.remove('cursor-hover');
        dot.classList.remove('dot-hover');
      }
    });
  }

  function initClickSounds() {
    let audioCtx = null;
    function playClick() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {}
    }
    document.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .gallery-item, .service, .urgency-option, .transport-option, .quick-hint, .achievement, .zone-item')) playClick();
    });
  }
})();

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====

function logout() {
  const msg = (localStorage.getItem('lang') || 'ru') === 'en' ? 'Log out?' : 'Выйти из системы?';
  if (confirm(msg)) {
    localStorage.clear();
    window.location.href = '/index.html';
  }
}

function cycleTheme() {
  const themes = ['light', 'dark', 'sepia'];
  const current = localStorage.getItem('theme') || 'light';
  const next = themes[(themes.indexOf(current) + 1) % themes.length];
  localStorage.setItem('theme', next);
  document.body.setAttribute('data-theme', next);
  const names = { light: 'toast.light', dark: 'toast.dark', sepia: 'toast.sepia' };
  showToast(t(names[next]));
}

function toggleLang() {
  const current = localStorage.getItem('lang') || 'ru';
  const next = current === 'ru' ? 'en' : 'ru';
  localStorage.setItem('lang', next);
  document.documentElement.setAttribute('data-lang', next);

  const label = document.getElementById('langLabel');
  if (label) label.textContent = next.toUpperCase();

  showToast(next === 'ru' ? t('toast.ru') : t('toast.en'));

  applyTranslations();
  if (window.updateGreeting) window.updateGreeting();
  if (window.updateDate) window.updateDate();

  setTimeout(() => window.location.reload(), 500);
}

function showToast(text) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visible'), 2000);
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#D4A574', '#A0704A', '#E8C29A', '#7DA52D', '#4A90E2'];
  const particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2, y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15 - 3,
      size: Math.random() * 8 + 4, color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360, vr: (Math.random() - 0.5) * 15, opacity: 1
    });
  }
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.rotation += p.vr; p.opacity -= 0.012;
      if (p.opacity > 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });
    frame++;
    if (frame < 120) requestAnimationFrame(animate);
    else { canvas.style.display = 'none'; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  animate();
}