import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Product {
  id: number;
  name: string;
  article: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const products: Product[] = [
    {
      id: 1,
      name: 'Тормозной диск передний',
      article: 'BRK-2024-F',
      price: 8500,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/84be32cf-90cd-4788-a703-658d473cc03d.jpg',
      category: 'Тормозная система'
    },
    {
      id: 2,
      name: 'Масляный фильтр премиум',
      article: 'OIL-2024-P',
      price: 1200,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/83ccba65-5123-46ba-af37-5530c5f4ecfd.jpg',
      category: 'Фильтры'
    },
    {
      id: 3,
      name: 'Тормозной диск задний',
      article: 'BRK-2024-R',
      price: 7800,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/84be32cf-90cd-4788-a703-658d473cc03d.jpg',
      category: 'Тормозная система'
    },
    {
      id: 4,
      name: 'Воздушный фильтр спорт',
      article: 'AIR-2024-S',
      price: 2400,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/83ccba65-5123-46ba-af37-5530c5f4ecfd.jpg',
      category: 'Фильтры'
    },
    {
      id: 5,
      name: 'Комплект тормозных колодок',
      article: 'PAD-2024-K',
      price: 4500,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/84be32cf-90cd-4788-a703-658d473cc03d.jpg',
      category: 'Тормозная система'
    },
    {
      id: 6,
      name: 'Топливный фильтр',
      article: 'FUEL-2024-F',
      price: 1800,
      image: 'https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/83ccba65-5123-46ba-af37-5530c5f4ecfd.jpg',
      category: 'Фильтры'
    }
  ];

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({ ...prev, [id]: newQuantity }));
  };

  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="animate-fade-in">
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/00fb6f74-b48c-4c6b-abf6-157e790e39ae.jpg"
                  alt="Hero"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
              </div>
              <div className="relative z-10 text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary font-heading">
                  Premium Auto Parts
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Эксклюзивные автозапчасти для ценителей качества
                </p>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
                  onClick={() => setCurrentPage('catalog')}
                >
                  Перейти в каталог
                </Button>
              </div>
            </section>

            <section className="py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 font-heading">
                  Почему выбирают нас
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: 'Shield', title: 'Гарантия качества', desc: 'Только оригинальные запчасти от проверенных производителей' },
                    { icon: 'Truck', title: 'Быстрая доставка', desc: 'Доставим в течение 24 часов по всей России' },
                    { icon: 'HeadphonesIcon', title: 'Поддержка 24/7', desc: 'Наши специалисты всегда готовы помочь с выбором' }
                  ].map((feature, idx) => (
                    <Card key={idx} className="bg-card border-border hover:border-primary transition-all hover:scale-105">
                      <CardContent className="pt-8 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name={feature.icon as any} size={32} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 font-heading">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'catalog':
        return (
          <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold mb-12 font-heading">Каталог товаров</h1>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="bg-card border-border hover:border-primary transition-all overflow-hidden group">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">
                        {product.category}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2 font-heading">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Артикул: {product.article}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) - 1)}
                            className="h-10 w-10"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-12 text-center">{quantities[product.id] || 1}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(product.id, (quantities[product.id] || 1) + 1)}
                            className="h-10 w-10"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                        <Button
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={() => addToCart(product)}
                        >
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          В корзину
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 font-heading">О нас</h1>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Premium Auto Parts — это эксклюзивный поставщик высококачественных автозапчастей для ценителей совершенства.
                </p>
                <p>
                  Мы работаем только с проверенными мировыми производителями и гарантируем подлинность каждой детали.
                  Наша команда экспертов всегда готова помочь вам подобрать идеальные запчасти для вашего автомобиля.
                </p>
                <p>
                  За годы работы мы заслужили доверие тысяч клиентов, которые ценят качество, надежность и безупречный сервис.
                </p>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 font-heading">Контакты</h1>
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Icon name="MapPin" size={24} className="text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Адрес</h3>
                        <p className="text-muted-foreground">г. Москва, ул. Автомобильная, д. 1</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                      <Icon name="Phone" size={24} className="text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Телефон</h3>
                        <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Icon name="Mail" size={24} className="text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@premiumautoparts.ru</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="py-12 px-4 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 font-heading">Доставка и оплата</h1>
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 font-heading">Способы доставки</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Курьерская доставка по Москве — 500 ₽ (бесплатно от 10 000 ₽)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Доставка по России — от 800 ₽ (зависит от региона)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Самовывоз из шоурума — бесплатно</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 font-heading">Способы оплаты</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Наличными при получении</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Банковской картой онлайн</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-primary mt-1" />
                        <span>Безналичный расчет для юридических лиц</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Icon name="Wrench" size={32} className="text-primary" />
            <span className="text-2xl font-bold font-heading">Premium Auto Parts</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', label: 'Главная' },
              { id: 'catalog', label: 'Каталог' },
              { id: 'about', label: 'О нас' },
              { id: 'contacts', label: 'Контакты' },
              { id: 'delivery', label: 'Доставка' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg bg-background">
              <SheetHeader>
                <SheetTitle className="font-heading">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col h-full">
                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto space-y-4">
                      {cart.map((item) => (
                        <Card key={item.id} className="bg-card border-border">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">{item.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{item.article}</p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-primary">{item.price.toLocaleString()} ₽</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Icon name="Minus" size={14} />
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Icon name="Plus" size={14} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFromCart(item.id)}
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                      <Icon name="Trash2" size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary">{getTotalPrice().toLocaleString()} ₽</span>
                      </div>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>{renderContent()}</main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 font-heading">Premium Auto Parts</h3>
              <p className="text-sm text-muted-foreground">
                Эксклюзивные автозапчасти для ценителей качества
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Контакты</h3>
              <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
              <p className="text-sm text-muted-foreground">info@premiumautoparts.ru</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Режим работы</h3>
              <p className="text-sm text-muted-foreground">Пн-Пт: 9:00 - 21:00</p>
              <p className="text-sm text-muted-foreground">Сб-Вс: 10:00 - 19:00</p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            © 2024 Premium Auto Parts. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
