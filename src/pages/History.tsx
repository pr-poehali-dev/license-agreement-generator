import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Contract {
  contractNumber: string;
  nickname: string;
  fullName: string;
  shortName: string;
  contractDate: string;
  citizenship: string;
  email: string;
  passport: string;
  createdAt: string;
}

export default function History() {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/50a6fb2c-a9a9-41d6-9553-3fe37d8edd44');
      if (!response.ok) throw new Error('Failed to load');
      
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить историю договоров',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-montserrat font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              История договоров
            </h1>
            <p className="text-muted-foreground font-inter">
              Все сгенерированные договоры в одном месте
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Icon name="ArrowLeft" size={18} />
              Назад к форме
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          </div>
        ) : contracts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="FileText" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-montserrat font-semibold mb-2">Нет договоров</h3>
              <p className="text-muted-foreground mb-6">Создайте первый договор, чтобы увидеть его здесь</p>
              <Link to="/">
                <Button className="gap-2">
                  <Icon name="Plus" size={18} />
                  Создать договор
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Card key={contract.contractNumber} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-montserrat flex items-center gap-2 text-xl">
                        <Icon name="FileCheck" size={20} className="text-primary" />
                        {contract.contractNumber}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Создан: {formatDate(contract.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="User" size={14} />
                        Никнейм
                      </p>
                      <p className="font-medium font-inter">{contract.nickname}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="UserCheck" size={14} />
                        ФИО
                      </p>
                      <p className="font-medium font-inter text-sm">{contract.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        Дата договора
                      </p>
                      <p className="font-medium font-inter">{contract.contractDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Globe" size={14} />
                        Гражданство
                      </p>
                      <p className="font-medium font-inter">{contract.citizenship}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Mail" size={14} />
                        Email
                      </p>
                      <p className="font-medium font-inter text-sm">{contract.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="CreditCard" size={14} />
                        Паспорт
                      </p>
                      <p className="font-medium font-inter text-sm">{contract.passport}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Всего договоров: <span className="font-semibold">{contracts.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}