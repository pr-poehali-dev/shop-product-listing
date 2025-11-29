import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { products, categories, Product, Category } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    article: '',
    description: '',
    price: 0,
    discount: 0,
    image_url: '',
    category_id: 0,
    stock: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (!isAdmin) {
      toast.error('Доступ запрещен');
      navigate('/');
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        products.getAll(),
        categories.getAll()
      ]);
      setProductsList(prods);
      setCategoriesList(cats);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.article || formData.price <= 0) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    try {
      if (editingProduct) {
        await products.update(editingProduct.id, formData);
        toast.success('Товар обновлен');
      } else {
        await products.create(formData);
        toast.success('Товар добавлен');
      }
      
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Ошибка сохранения товара');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      article: '',
      description: '',
      price: 0,
      discount: 0,
      image_url: '',
      category_id: 0,
      stock: 0
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      article: product.article,
      description: product.description || '',
      price: product.price,
      discount: product.discount,
      image_url: product.image_url || '',
      category_id: product.category_id,
      stock: product.stock
    });
    setShowForm(true);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              На сайт
            </Button>
            <h1 className="text-3xl font-bold font-heading">Админ-панель CARFIX</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить товар
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Редактировать товар' : 'Новый товар'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="article">Артикул *</Label>
                    <Input
                      id="article"
                      value={formData.article}
                      onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Скидка (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Остаток</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Select
                      value={formData.category_id.toString()}
                      onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image">URL изображения</Label>
                  <Input
                    id="image"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-primary">
                    {editingProduct ? 'Сохранить' : 'Добавить'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Товары ({productsList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {productsList.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Артикул: {product.article} | Категория: {product.category_name || 'Без категории'}
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {product.price.toLocaleString()} ₽
                      {product.discount > 0 && <span className="text-xs ml-2">-{product.discount}%</span>}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Icon name="Edit" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
