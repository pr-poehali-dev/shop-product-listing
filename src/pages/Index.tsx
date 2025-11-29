import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { auth, products as productsApi, categories as categoriesApi, Product, Category } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const { user, login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '' });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      toast.error('Ошибка загрузки категорий');
    }
  };

  const loadProducts = async () => {
    try {
      const data = selectedCategory 
        ? await productsApi.getAll(selectedCategory)
        : await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error('Ошибка загрузки товаров');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = authMode === 'login'
        ? await auth.login(authForm.username, authForm.password)
        : await auth.register(authForm.username, authForm.password, authForm.email);
      
      if (result.success) {
        login(result.user);
        setShowAuthDialog(false);
        toast.success(authMode === 'login' ? 'Вход выполнен' : 'Регистрация выполнена');
        setAuthForm({ username: '', password: '', email: '' });
      }
    } catch (error) {
      toast.error('Ошибка авторизации');
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success('Товар добавлен в корзину');
  };

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const renderHome = () => (
    <div className="animate-fade-in">
      <section className="relative h-[600px] flex items-center overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="absolute right-0 top-0 h-full w-3/5">
          <img
            src="https://cdn.poehali.dev/projects/789b97f8-c5e1-4c7f-aac1-68b73b7215a1/files/8f4e1158-6738-4251-a070-a8d8b24ac938.jpg"
            alt="LADA"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-heading">
              АВТОЗАПЧАСТИ И ТЮНИНГ — ОНЛАЙН
            </h1>
            <p className="text-xl md:text-2xl mb-4">
              Всё для ремонта и стиля <span className="text-primary font-semibold">вашего авто</span>.
            </p>
            <p className="text-lg mb-8 text-muted-foreground">
              С Доставкой по всей России.
            </p>
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 font-semibold px-8 h-12"
              onClick={() => setCurrentPage('catalog')}
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Перейти в каталог
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 font-heading">Популярные категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage('catalog');
                }}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Icon name={category.icon_name as any} size={40} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 font-heading">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.product_count} товаров</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderCatalog = () => (
    <div className="py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-heading">Каталог товаров</h1>
          {selectedCategory && (
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              <Icon name="X" size={16} className="mr-2" />
              Сбросить фильтр
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const finalPrice = product.discount > 0 
              ? product.price * (1 - product.discount / 100)
              : product.price;
            
            return (
              <Card key={product.id} className="hover:shadow-lg transition-all overflow-hidden group">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="Package" size={64} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  {product.category_name && (
                    <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">
                      {product.category_name}
                    </Badge>
                  )}
                  {product.discount > 0 && (
                    <Badge className="mb-3 ml-2 bg-red-100 text-red-600 hover:bg-red-200">
                      -{product.discount}%
                    </Badge>
                  )}
                  <h3 className="text-xl font-semibold mb-2 font-heading line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Артикул: {product.article}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">{finalPrice.toLocaleString()} ₽</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full bg-primary text-white hover:bg-primary/90"
                    onClick={() => addToCart(product)}
                  >
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return renderHome();
      case 'catalog': return renderCatalog();
      case 'about':
        return (
          <div className="py-12 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading">О нас</h1>
            <div className="space-y-6 text-lg">
              <p>CARFIX — интернет-магазин автозапчастей и тюнинга для автомобилей LADA (ВАЗ).</p>
              <p>Мы предлагаем широкий ассортимент оригинальных и качественных запчастей с доставкой по всей России.</p>
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className="py-12 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading">Контакты</h1>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <Icon name="MapPin" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p className="text-muted-foreground">г. Тольятти, ул. Офицерская, 24</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Phone" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <a href="tel:+79967353767" className="text-muted-foreground hover:text-primary">+7 (996) 735-37-67</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="Mail" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:carfix100122@yandex.ru" className="text-muted-foreground hover:text-primary">carfix100122@yandex.ru</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telegram поддержка</h3>
                    <a href="https://t.me/admsupp63" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                      @admsupp63
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'delivery':
        return (
          <div className="py-12 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading">Доставка и оплата</h1>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 font-heading">Доставка</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Доставка по Тольятти — 300 ₽</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Доставка по России — рассчитывается индивидуально</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Самовывоз — бесплатно</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 font-heading">Оплата</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Наличными при получении</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Банковской картой</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon name="Check" size={20} className="text-primary mt-1" />
                      <span>Безналичный расчет</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2">
                <div className="text-3xl font-bold text-foreground font-heading">
                  CAR<span className="text-primary">FIX</span>
                </div>
              </button>
              <nav className="hidden md:flex items-center gap-6">
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
                    className={`text-sm font-medium transition-colors ${
                      currentPage === item.id ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://t.me/admsupp63"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Icon name="MessageCircle" size={20} />
                Поддержка
              </a>
              
              {user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                      <Icon name="Settings" size={16} className="mr-2" />
                      Админ
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выход
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAuthDialog(true)}>
                  <Icon name="User" size={16} className="mr-2" />
                  Войти
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" size="icon" className="relative bg-primary">
                    <Icon name="ShoppingCart" size={20} />
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                        {cart.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
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
                          {cart.map((item) => {
                            const finalPrice = item.discount > 0 
                              ? item.price * (1 - item.discount / 100)
                              : item.price;
                            
                            return (
                              <Card key={item.id}>
                                <CardContent className="p-4">
                                  <div className="flex gap-4">
                                    {item.image_url && (
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                      />
                                    )}
                                    <div className="flex-1">
                                      <h4 className="font-semibold mb-1">{item.name}</h4>
                                      <p className="text-sm text-muted-foreground mb-2">{item.article}</p>
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-primary">{finalPrice.toLocaleString()} ₽</span>
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
                                            onClick={() => updateCartQuantity(item.id, 0)}
                                            className="h-8 w-8 p-0 text-destructive"
                                          >
                                            <Icon name="Trash2" size={14} />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Итого:</span>
                            <span className="text-2xl font-bold text-primary">{getTotalPrice().toLocaleString()} ₽</span>
                          </div>
                          <Button className="w-full bg-primary font-semibold" onClick={() => toast.success('Функция оформления заказа в разработке')}>
                            Оформить заказ
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main>{renderContent()}</main>

      <footer className="border-t mt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 font-heading">
                CAR<span className="text-primary">FIX</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Автозапчасти и тюнинг для LADA (ВАЗ)
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Контакты</h3>
              <p className="text-sm text-muted-foreground">г. Тольятти, ул. Офицерская, 24</p>
              <p className="text-sm text-muted-foreground">+7 (996) 735-37-67</p>
              <p className="text-sm text-muted-foreground">carfix100122@yandex.ru</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Поддержка</h3>
              <a href="https://t.me/admsupp63" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary">
                Telegram: @admsupp63
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            © 2024 CARFIX. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {authMode === 'login' ? 'Вход' : 'Регистрация'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required
              />
            </div>
            {authMode === 'register' && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary">
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <button
              type="button"
              className="w-full text-center text-sm text-muted-foreground hover:text-primary"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
