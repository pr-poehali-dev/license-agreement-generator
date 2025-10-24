import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractNumber: '',
    contractDate: '',
    citizenship: '',
    fullName: '',
    shortName: '',
    nickname: '',
    passport: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    const requiredFields = ['contractNumber', 'contractDate', 'citizenship', 'fullName', 'shortName', 'nickname', 'passport', 'email'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (emptyFields.length > 0) {
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, заполните все обязательные поля формы',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    toast({
      title: 'Генерация началась',
      description: 'Создаём пакет документов...'
    });

    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Готово!',
        description: 'Документы успешно сгенерированы'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <Icon name="FileText" size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-montserrat font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
            Генератор Лицензионных Договоров
          </h1>
          <p className="text-lg text-muted-foreground font-inter max-w-2xl mx-auto">
            Создайте полный пакет юридических документов за несколько минут
          </p>
        </div>

        <Tabs defaultValue="form" className="w-full animate-scale-in">
          <TabsList className="grid grid-cols-5 w-full mb-8 h-14 bg-card/50 backdrop-blur p-1">
            <TabsTrigger value="form" className="font-montserrat flex items-center gap-2">
              <Icon name="FileEdit" size={18} />
              <span className="hidden sm:inline">Форма</span>
            </TabsTrigger>
            <TabsTrigger value="instructions" className="font-montserrat flex items-center gap-2">
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Инструкция</span>
            </TabsTrigger>
            <TabsTrigger value="example" className="font-montserrat flex items-center gap-2">
              <Icon name="Lightbulb" size={18} />
              <span className="hidden sm:inline">Пример</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="font-montserrat flex items-center gap-2">
              <Icon name="HelpCircle" size={18} />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="font-montserrat flex items-center gap-2">
              <Icon name="Mail" size={18} />
              <span className="hidden sm:inline">Контакты</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card className="shadow-xl border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
                  <Icon name="FileSignature" size={24} />
                  Данные для договора
                </CardTitle>
                <CardDescription className="font-inter">
                  Заполните все поля для генерации документов
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber" className="font-montserrat flex items-center gap-2">
                      <Icon name="Hash" size={16} />
                      Номер договора
                    </Label>
                    <Input
                      id="contractNumber"
                      placeholder="25/10/2025"
                      value={formData.contractNumber}
                      onChange={(e) => handleInputChange('contractNumber', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractDate" className="font-montserrat flex items-center gap-2">
                      <Icon name="Calendar" size={16} />
                      Дата заключения
                    </Label>
                    <Input
                      id="contractDate"
                      placeholder="25 октября 2025 г."
                      value={formData.contractDate}
                      onChange={(e) => handleInputChange('contractDate', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citizenship" className="font-montserrat flex items-center gap-2">
                      <Icon name="Globe" size={16} />
                      Гражданство
                    </Label>
                    <Input
                      id="citizenship"
                      placeholder="Германии"
                      value={formData.citizenship}
                      onChange={(e) => handleInputChange('citizenship', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-montserrat flex items-center gap-2">
                      <Icon name="User" size={16} />
                      ФИО полностью (родительный падеж)
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="EDUARD FRANK IOSIFOVIC"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortName" className="font-montserrat flex items-center gap-2">
                      <Icon name="UserCheck" size={16} />
                      ФИО кратко (для подписи)
                    </Label>
                    <Input
                      id="shortName"
                      placeholder="EDUARD F.I."
                      value={formData.shortName}
                      onChange={(e) => handleInputChange('shortName', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="font-montserrat flex items-center gap-2">
                      <Icon name="Sparkles" size={16} />
                      Творческий псевдоним
                    </Label>
                    <Input
                      id="nickname"
                      placeholder="EDDI$"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport" className="font-montserrat flex items-center gap-2">
                      <Icon name="CreditCard" size={16} />
                      Паспортные данные
                    </Label>
                    <Input
                      id="passport"
                      placeholder="GER: L8V2RCZ80"
                      value={formData.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value)}
                      className="font-inter"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-montserrat flex items-center gap-2">
                      <Icon name="AtSign" size={16} />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="mr-frank-eduard@web.de"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="font-inter"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-montserrat font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" size={24} className="animate-spin mr-2" />
                      Генерируем документы...
                    </>
                  ) : (
                    <>
                      <Icon name="Download" size={24} className="mr-2" />
                      Сгенерировать договор
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructions">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Инструкция по использованию
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 font-inter">
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-montserrat font-semibold mb-1">Заполните форму</h3>
                    <p className="text-muted-foreground">Внесите все данные лицензиара в соответствующие поля. Все поля обязательны для заполнения.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-montserrat font-semibold mb-1">Проверьте данные</h3>
                    <p className="text-muted-foreground">Убедитесь, что все введённые данные корректны. Особое внимание уделите ФИО и паспортным данным.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-montserrat font-semibold mb-1">Сгенерируйте документы</h3>
                    <p className="text-muted-foreground">Нажмите кнопку "Сгенерировать договор". Система создаст ZIP-архив с полным пакетом документов.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-montserrat font-semibold mb-1">Скачайте и используйте</h3>
                    <p className="text-muted-foreground">Архив содержит: основной договор, 3 приложения и акт приёма-передачи. Все документы готовы к подписанию.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-start gap-3">
                    <Icon name="Shield" size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-montserrat font-semibold mb-1">Конфиденциальность</h4>
                      <p className="text-sm text-muted-foreground">Ваши данные не сохраняются на сервере. Все документы генерируются в реальном времени и сразу удаляются после скачивания.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="example">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
                <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
                  <Icon name="Lightbulb" size={24} />
                  Пример заполнения
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4 font-inter">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Номер договора</p>
                      <p className="font-semibold">25/10/2025</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Дата заключения</p>
                      <p className="font-semibold">25 октября 2025 г.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Гражданство</p>
                      <p className="font-semibold">Германии</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">ФИО полностью</p>
                      <p className="font-semibold">EDUARD FRANK IOSIFOVIC</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">ФИО кратко</p>
                      <p className="font-semibold">EDUARD F.I.</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Псевдоним</p>
                      <p className="font-semibold">EDDI$</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Паспортные данные</p>
                      <p className="font-semibold">GER: L8V2RCZ80</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-montserrat font-semibold text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold">mr-frank-eduard@web.de</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 border border-accent/30 rounded-lg bg-accent/5">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={24} className="text-accent flex-shrink-0" />
                      <div>
                        <h4 className="font-montserrat font-semibold mb-1">Обратите внимание</h4>
                        <p className="text-sm text-muted-foreground">ФИО указывается в родительном падеже (кого?). Дата должна быть написана полностью текстом.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
                  <Icon name="HelpCircle" size={24} />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-montserrat font-semibold">
                      Какие документы входят в пакет?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      В пакет входит 5 документов: основной лицензионный договор, Приложение №1 (Перечень Произведений), 
                      Приложение №2 (Дизайн-макеты), Приложение №3 (Финансовые условия) и Акт приёма-передачи.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-montserrat font-semibold">
                      Сохраняются ли мои данные на сервере?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Нет, ваши персональные данные не сохраняются. Генерация происходит в оперативной памяти сервера 
                      и все данные удаляются сразу после формирования архива с документами.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-montserrat font-semibold">
                      В каком формате будут документы?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Все документы генерируются в формате DOCX (Microsoft Word) и упаковываются в ZIP-архив. 
                      Документы сохраняют оригинальное форматирование и готовы к использованию.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-montserrat font-semibold">
                      Можно ли изменить документы после генерации?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Да, все документы можно редактировать в Word или других текстовых редакторах. 
                      Форматирование останется без изменений.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="font-montserrat font-semibold">
                      Имеют ли документы юридическую силу?
                    </AccordionTrigger>
                    <AccordionContent className="font-inter text-muted-foreground">
                      Документы создаются на основе юридически корректного шаблона. Однако мы рекомендуем 
                      проконсультироваться с юристом перед подписанием любых договоров.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
                <CardTitle className="font-montserrat text-2xl flex items-center gap-2">
                  <Icon name="Mail" size={24} />
                  Контакты для связи
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6 font-inter">
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="Mail" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground mb-2">Для общих вопросов и поддержки</p>
                      <a href="mailto:support@example.com" className="text-primary font-semibold hover:underline">
                        support@example.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-xl border border-secondary/20">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon name="MessageCircle" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Онлайн-чат</h3>
                      <p className="text-muted-foreground mb-2">Быстрая помощь в рабочее время (пн-пт, 9:00-18:00)</p>
                      <Button variant="outline" className="mt-2">
                        Открыть чат
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-xl border border-accent/20">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <Icon name="Phone" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Телефон</h3>
                      <p className="text-muted-foreground mb-2">Техническая поддержка</p>
                      <a href="tel:+78001234567" className="text-accent font-semibold hover:underline text-xl">
                        +7 (800) 123-45-67
                      </a>
                    </div>
                  </div>

                  <div className="mt-8 p-6 border-2 border-dashed border-primary/30 rounded-xl text-center">
                    <Icon name="Clock" size={32} className="mx-auto mb-3 text-primary" />
                    <h3 className="font-montserrat font-semibold text-lg mb-2">Время работы</h3>
                    <p className="text-muted-foreground">
                      Понедельник - Пятница: 9:00 - 18:00<br />
                      Суббота - Воскресенье: Выходной
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center text-muted-foreground font-inter text-sm">
          <p>© 2025 Генератор Лицензионных Договоров. Все права защищены.</p>
        </footer>
      </div>
    </div>
  );
}
